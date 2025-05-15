import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { StarIcon, CameraIcon } from "@heroicons/react/24/solid";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import defaultRestaurantImage from "../../assets/default-restaurant.png";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

export default function RestaurantDetails() {
  const [editMode, setEditMode] = useState(false);
  const [newCuisine, setNewCuisine] = useState("");
  const [newTable, setNewTable] = useState({ description: "", capacity: "" });
  const [restaurant, setRestaurant] = useState(null);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [deletedImageUrls, setDeletedImageUrls] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [allCuisines, setAllCuisines] = useState([]);
  const [deletedCuisineIds, setDeletedCuisineIds] = useState([]);
  const [tables, setTables] = useState([]);
  const [newTables, setNewTables] = useState([]);
  const [deletedTableIds, setDeletedTableIds] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const restaurantId = localStorage.getItem("restaurantId");
  const userId = localStorage.getItem("userId");

  const fetchData = async () => {
    try {
      const [restaurantRes, imageRes, statsRes, allcuisinesRes] =
        await Promise.all([
          axios.get(`http://localhost:5000/api/restaurants/${restaurantId}`),
          axios.get(
            `http://localhost:5000/api/restaurants/${restaurantId}/images`
          ),
          axios.get(`http://localhost:5000/api/stats/${restaurantId}`),
          axios.get("http://localhost:5000/api/cuisines"),
        ]);

      // Convert profilePic buffer to object URL
      let profilePicUrl = null;
      const buffer = restaurantRes.data.data.ProfilePic;
      if (buffer?.data) {
        const byteArray = new Uint8Array(buffer.data);
        const blob = new Blob([byteArray], { type: "image/jpeg" });
        profilePicUrl = URL.createObjectURL(blob);
      }

      // Convert all image buffers to object URLs
      const imagesArray = Array.isArray(imageRes.data?.data)
        ? imageRes.data.data
            .filter((imgBuffer) => imgBuffer?.Image?.data)
            .map((imgBuffer) => {
              const byteArray = new Uint8Array(imgBuffer.Image.data);
              const blob = new Blob([byteArray], { type: "image/jpeg" });
              const url = URL.createObjectURL(blob);
              return { url, ImageID: imgBuffer.ImageID, isNew: false };
            })
        : [];

      // Fetch cuisines
      let cuisinesData = [];
      try {
        const cuisinesRes = await axios.get(
          `http://localhost:5000/api/restaurants/${restaurantId}/cuisines`
        );
        cuisinesData = cuisinesRes.data.data;
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error("Failed to fetch cuisines:", err);
        }
      }

      // Fetch Tables
      let tablesData = [];
      try {
        const tablesRes = await axios.get(
          `http://localhost:5000/api/restaurants/${restaurantId}/tables`
        );
        tablesData = tablesRes.data;
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error("Failed to fetch tables:", err);
        }
      }
      const mergedRestaurant = {
        ...restaurantRes.data.data,
        ...statsRes.data.data,
        profilePicUrl,
      };

      // Set state
      setRestaurant(mergedRestaurant);
      setImages(imagesArray);
      setCuisines(cuisinesData);
      setAllCuisines(allcuisinesRes.data.data);
      tablesData = tablesData.map((t) => ({
        TableID: t.TableID || null,
        capacity: t.Capacity,
        description: t.Description,
      }));
      setTables(tablesData);
    } catch (err) {
      console.error("Failed to fetch restaurant data:", err);
    }
  };

  useEffect(() => {
    if (!restaurantId) return;

    fetchData();
  }, []);

  const handleCuisineAdd = () => {
    const selectedCuisine = allCuisines.find(
      (c) => c.CuisineID === Number(newCuisine)
    );

    if (
      selectedCuisine &&
      !cuisines.some((c) => c.CuisineName === selectedCuisine.Name)
    ) {
      setCuisines([
        ...cuisines,
        {
          CuisineID: selectedCuisine.CuisineID,
          CuisineName: selectedCuisine.Name,
          isNew: true,
        },
      ]);
      setNewCuisine("");
    }
  };

  const handleCuisineRemove = (index) => {
    const cuisineToRemove = cuisines[index];
    if (cuisineToRemove.CuisineID) {
      setDeletedCuisineIds((prev) => [...prev, cuisineToRemove.CuisineID]);
    }
    setCuisines(cuisines.filter((_, i) => i !== index));
  };

  const handleTableAdd = () => {
    const { description, capacity } = newTable;
    const parsedCapacity = parseInt(capacity);

    if (!description || isNaN(parsedCapacity)) return;

    setNewTables((prev) => [
      ...prev,
      { description, capacity: parsedCapacity },
    ]);

    setTables((prev) => [
      ...prev,
      { description, capacity: parsedCapacity, isNew: true },
    ]);

    setNewTable({ description: "", capacity: "" });
  };

  const handleTableRemove = (index) => {
    const tableToRemove = tables[index];

    if (!tableToRemove.isNew && tableToRemove.TableID) {
      setDeletedTableIds((prev) => [...prev, tableToRemove.TableID]);
    } else {
      setNewTables((prev) =>
        prev.filter(
          (t) =>
            !(
              t.description === tableToRemove.description &&
              t.capacity === tableToRemove.capacity
            )
        )
      );
    }

    setTables((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProfilePictureUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);

    setRestaurant((prev) => ({
      ...prev,
      profilePicUrl: localUrl,
      profilePicFile: file,
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    const newImageUrls = files.map((file) => ({
      url: URL.createObjectURL(file),
      file, // for uploading later
      isNew: true,
    }));

    setImages((prev) => [...prev, ...newImageUrls]);
    setNewImages((prev) => [...prev, ...newImageUrls]);
  };

  const handleImageRemove = (index) => {
    const imageToRemove = images[index];

    if (!imageToRemove.isNew && imageToRemove.ImageID) {
      setDeletedImageUrls((prev) => [...prev, imageToRemove.ImageID]);
    } else {
      // If it's new, also remove from newImages
      setNewImages((prev) =>
        prev.filter((img) => img.url !== imageToRemove.url)
      );
    }

    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const formatTimeForInput = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatTimeForDisplay = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const updateTimeInISO = (isoString, timeStr) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const [hours, minutes] = timeStr.split(":");
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.toISOString();
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (editMode) {
      try {
        const formData = new FormData();
        formData.append("UserID", userId);
        formData.append("RestaurantID", restaurantId);
        formData.append("Name", restaurant.Name || "");
        formData.append("Description", restaurant.Description || "");
        formData.append("PhoneNum", restaurant.PhoneNum || "");
        formData.append(
          "OperatingHoursStart",
          restaurant.OperatingHoursStart || ""
        );
        formData.append(
          "OperatingHoursEnd",
          restaurant.OperatingHoursEnd || ""
        );

        if (restaurant.profilePicFile) {
          formData.append("ProfilePic", restaurant.profilePicFile);
        }

        try {
          await axios.put("http://localhost:5000/api/restaurants", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        } catch (err) {
          console.error("Update restaurant failed:", err);

          if (err.response && err.response.data) {
            const backendMessage =
              err.response.data.message || "An error occurred.";
            setErrorMessage(backendMessage);
          } else if (err.request) {
            setErrorMessage(
              "No response from the server. Please try again later."
            );
          } else {
            setErrorMessage(`Unexpected error: ${err.message}`);
          }

          return;
        }

        // Upload new images
        for (const img of newImages) {
          const formData = new FormData();
          formData.append("image", img.file);
          formData.append("UserID", userId);

          await axios.post(
            `http://localhost:5000/api/restaurants/${restaurantId}/add-image`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
        }

        // Delete removed images
        for (const imageId of deletedImageUrls) {
          await axios.delete(
            `http://localhost:5000/api/restaurants/${restaurantId}/delete-image`,
            {
              data: {
                UserID: userId,
                ImageID: imageId,
              },
            }
          );
        }

        // Add new tables
        for (const table of newTables) {
          await axios.post("http://localhost:5000/api/tables", {
            userId,
            restaurantId,
            description: table.description,
            capacity: table.capacity,
          });
        }

        // Delete removed tables
        for (const tableId of deletedTableIds) {
          await axios.delete(`http://localhost:5000/api/tables/${tableId}`, {
            data: { userId },
          });
        }

        // Add new cuisines
        for (const cuisine of cuisines) {
          if (cuisine.isNew) {
            await axios.post("http://localhost:5000/api/restaurants-cuisines", {
              RestaurantID: restaurantId,
              CuisineID: cuisine.CuisineID,
            });
          }
        }

        // Remove deleted cuisines
        for (const cuisineId of deletedCuisineIds) {
          await axios.delete("http://localhost:5000/api/restaurants-cuisines", {
            params: {
              RestaurantID: restaurantId,
              CuisineID: cuisineId,
            },
          });
        }

        // Clear temporary state
        setNewImages([]);
        setDeletedImageUrls([]);
        setNewTables([]);
        setDeletedTableIds([]);
        setDeletedCuisineIds([]);
        setErrorMessage("");
        await fetchData();
      } catch (err) {
        console.error("Failed to update images:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!restaurant)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <ArrowPathIcon className="h-5 w-5 animate-spin text-theme-pink" />
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-gray-50 text-theme-brown p-6 relative">
      {/* Top Navigation */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4">
          <Link
            className="bg-theme-pink text-white px-4 py-2 rounded shadow-md"
            to="/admin/restaurants/details"
          >
            Details
          </Link>
          <Link
            className="bg-white border px-4 py-2 rounded hover:bg-gray-100"
            to="/admin/restaurants/reviews"
          >
            Reviews
          </Link>
          <Link
            className="bg-white border px-4 py-2 rounded hover:bg-gray-100"
            to="/admin/restaurants/admins"
          >
            Admins
          </Link>
          <Link
            className="bg-white border px-4 py-2 rounded hover:bg-gray-100"
            to="/admin/restaurants/staff"
          >
            Staff
          </Link>
        </div>
        <button
          onClick={() => {
            if (editMode) handleSubmit();
            setEditMode(!editMode);
          }}
          disabled={loading}
          className="flex items-center gap-1 text-sm bg-gray-100 border px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Loading...
            </>
          ) : (
            <>
              <PencilIcon className="w-4 h-4" />
              {editMode ? "Finish Editing" : "Edit"}
            </>
          )}
        </button>
      </div>

      {/* Restaurant Info */}
      <div className="flex flex-col sm:flex-row gap-10 items-center pb-10">
        <div className="flex flex-col gap-4">
          <div className="relative w-60 aspect-square rounded-full overflow-hidden border-4 border-theme-pink shadow-md flex-shrink-0">
            <img
              src={restaurant?.profilePicUrl || defaultRestaurantImage}
              alt="Restaurant"
              className="w-full h-full object-cover"
            />
          </div>

          {editMode && (
            <label className="block mt-4 w-60 bg-theme-pink text-white text-xs font-semibold px-3 py-2 rounded-full shadow-md cursor-pointer hover:bg-theme-pink-dark transition-all duration-300 text-center">
              <input
                type="file"
                className="hidden"
                onChange={handleProfilePictureUpload}
              />
              <span className="flex items-center space-x-1 justify-center">
                <CameraIcon className="w-4 h-4" />
                <span>Change</span>
              </span>
            </label>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full max-w-2xl">
          {editMode ? (
            <>
              <input
                value={restaurant.Name}
                onChange={(e) =>
                  setRestaurant({ ...restaurant, Name: e.target.value })
                }
                className="text-xl font-bold border p-1 rounded"
              />
              <textarea
                value={restaurant.Description}
                onChange={(e) =>
                  setRestaurant({ ...restaurant, Description: e.target.value })
                }
                className="border p-1 rounded"
              />
              <input
                value={restaurant.PhoneNum}
                onChange={(e) =>
                  setRestaurant({ ...restaurant, PhoneNum: e.target.value })
                }
                className="border p-1 rounded"
              />
              {errorMessage && (
                <div className="text-red-500 text-sm">{errorMessage}</div>
              )}
              <div className="flex gap-2 items-center">
                <label className="text-sm">Hours:</label>
                <input
                  type="time"
                  value={formatTimeForInput(restaurant.OperatingHoursStart)}
                  onChange={(e) =>
                    setRestaurant({
                      ...restaurant,
                      OperatingHoursStart: updateTimeInISO(
                        restaurant.OperatingHoursStart,
                        e.target.value
                      ),
                    })
                  }
                  className="border p-1 rounded"
                />
                <span>-</span>
                <input
                  type="time"
                  value={formatTimeForInput(restaurant.OperatingHoursEnd)}
                  onChange={(e) =>
                    setRestaurant({
                      ...restaurant,
                      OperatingHoursEnd: updateTimeInISO(
                        restaurant.OperatingHoursEnd,
                        e.target.value
                      ),
                    })
                  }
                  className="border p-1 rounded"
                />
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-theme-pink">
                {restaurant.Name}
              </h1>
              <p className="text-sm italic text-gray-700">
                {restaurant.Description}
              </p>
              <p>
                <strong>Location:</strong> {restaurant.Location}
              </p>
              <p>
                <strong>Operating Hours:</strong>{" "}
                {formatTimeForDisplay(restaurant.OperatingHoursStart)} -{" "}
                {formatTimeForDisplay(restaurant.OperatingHoursEnd)}
              </p>
              <p>
                <strong>Phone:</strong> {restaurant.PhoneNum}
              </p>
            </>
          )}

          {/* Cuisines */}
          <div>
            <strong>Cuisines:</strong>
            <div className="flex flex-wrap gap-2 mt-1">
              {cuisines.length > 0
                ? cuisines.map((cuisine, i) => (
                    <div
                      key={i}
                      className="bg-theme-pink/10 text-theme-pink px-2 py-1 rounded flex items-center gap-1 text-sm"
                    >
                      {cuisine.CuisineName}
                      {editMode && (
                        <button
                          onClick={() => handleCuisineRemove(i)}
                          className="text-red-500"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))
                : "No cuisines offered!"}
              {editMode && (
                <div className="flex items-center gap-1">
                  <select
                    value={newCuisine}
                    onChange={(e) => setNewCuisine(e.target.value)}
                    className="border p-1 text-sm rounded"
                  >
                    <option value="">Choose Cuisine</option>
                    {allCuisines
                      .filter(
                        (c) =>
                          !cuisines.some((sel) => sel.CuisineName === c.Name)
                      )
                      .map((cuisine) => (
                        <option
                          key={cuisine.CuisineID}
                          value={cuisine.CuisineID}
                        >
                          {cuisine.Name}
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={handleCuisineAdd}
                    disabled={!newCuisine}
                    className="text-theme-pink disabled:opacity-50"
                  >
                    <PlusIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white p-8 rounded-lg shadow mb-10">
        <h2 className="text-2xl font-semibold text-theme-pink mb-4">
          Restaurant Stats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Reservations", value: restaurant.totalReservations },
            {
              label: "Avg. Rating",
              value: restaurant.averageRating,
              icon: <StarIcon className="w-5 h-5 text-yellow-500 inline" />,
            },
            { label: "Reviews", value: restaurant.totalReviews },
            { label: "Revenue", value: `$${restaurant.totalRevenue}` },
            { label: "Admins", value: restaurant.numAdmins },
            { label: "Staff", value: restaurant.numStaff },
          ].map((item, i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-4 shadow">
              <h3 className="text-sm text-gray-600">{item.label}</h3>
              <p className="text-xl font-semibold text-theme-pink flex items-center gap-1">
                {item.value}
                {item.icon}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tables */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-theme-pink mb-4">Tables</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {tables.length === 0 && !editMode && (
            <div className="col-span-full text-gray-500 italic">
              No tables added yet.
            </div>
          )}

          {tables.map((table, i) => (
            <div
              key={i}
              className="border rounded-lg p-4 bg-white shadow relative"
            >
              <p>
                <strong>Table {i + 1}</strong>
              </p>
              <p>Seats: {table.capacity}</p>
              <p>Description: {table.description}</p>
              {editMode && (
                <button
                  onClick={() => handleTableRemove(i)}
                  className="absolute top-1 right-1 text-red-500"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          {editMode && (
            <div className="border-dashed border-2 rounded-lg p-4 flex flex-col gap-2 justify-center items-center text-sm">
              <input
                type="number"
                min="1"
                placeholder="Capacity"
                className="border p-1 w-full rounded"
                value={newTable.capacity}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || Number(value) > 0) {
                    setNewTable({ ...newTable, capacity: value });
                  }
                }}
              />
              <input
                placeholder="Description"
                className="border p-1 w-full rounded"
                value={newTable.description}
                onChange={(e) =>
                  setNewTable({ ...newTable, description: e.target.value })
                }
              />
              <button onClick={handleTableAdd} className="text-theme-pink">
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Restaurant Images Section */}
      <div className="pb-16 mt-16">
        <h2 className="text-2xl font-semibold text-theme-pink mb-4">
          Restaurant Images
        </h2>

        {images.length === 0 && !editMode ? (
          <p className="text-gray-500 italic">
            No images available for this restaurant.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((src, i) => (
              <div key={i} className="relative group">
                <img
                  src={src.url}
                  alt={`Gallery ${i}`}
                  className="w-full h-48 object-cover rounded shadow"
                />
                {editMode && (
                  <button
                    onClick={() => handleImageRemove(i)}
                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow text-red-500"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {editMode && (
              <label className="border-dashed border-2 rounded-lg p-4 flex flex-col gap-2 justify-center items-center text-sm cursor-pointer text-theme-pink hover:bg-theme-pink/5 transition">
                <PlusIcon className="w-6 h-6" />
                Add Image
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
