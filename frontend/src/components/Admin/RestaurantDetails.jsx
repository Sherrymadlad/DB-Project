import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, CameraIcon } from '@heroicons/react/24/solid';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function RestaurantDetails() {
  const [editMode, setEditMode] = useState(false);
  const [restaurant, setRestaurant] = useState({
    name: 'The Spice Route',
    description: 'An exotic blend of traditional and modern Asian cuisine.',
    location: '123 Food Street, Karachi',
    cuisines: ['Thai', 'Indian', 'Chinese'],
    phone: '+92 300 1234567',
    startTime: '10:00',
    endTime: '21:00',
    rating: 4.7,
    image: 'https://source.unsplash.com/300x300/?restaurant',
    headerImage: 'https://source.unsplash.com/1600x400/?restaurant-interior',
    totalReservations: 120,
    avgRating: 4.7,
    reviewCount: 85,
    totalRevenue: 12000,
    adminCount: 3,
    staffCount: 15,
    tables: [
      { capacity: 4, description: "yes" },
      { capacity: 2, description: "no" },
      { capacity: 6, description: "hmmmmm" },
    ],
    galleryImages: [
      'https://source.unsplash.com/400x300/?restaurant,food,1',
      'https://source.unsplash.com/400x300/?restaurant,food,2',
    ],
  });

  const [newCuisine, setNewCuisine] = useState('');
  const [newTable, setNewTable] = useState({ number: '', capacity: '' });

  const handleCuisineAdd = () => {
    if (newCuisine.trim()) {
      setRestaurant({
        ...restaurant,
        cuisines: [...restaurant.cuisines, newCuisine.trim()],
      });
      setNewCuisine('');
    }
  };

  const handleCuisineRemove = (index) => {
    setRestaurant({
      ...restaurant,
      cuisines: restaurant.cuisines.filter((_, i) => i !== index),
    });
  };

  const handleTableAdd = () => {
    const description = newTable.description;
    const capacity = parseInt(newTable.capacity);
    if (!isNaN(capacity)) {
      setRestaurant({
        ...restaurant,
        tables: [...restaurant.tables, { capacity,description }],
      });
      setNewTable({ capacity: '',description: '' });
    }
  };

  const handleTableRemove = (index) => {
    setRestaurant({
      ...restaurant,
      tables: restaurant.tables.filter((_, i) => i !== index),
    });
  };

  const handleImageRemove = (index) => {
    setRestaurant({
      ...restaurant,
      galleryImages: restaurant.galleryImages.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 text-theme-brown p-6 relative">
      {/* Top Navigation */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4">
          <Link className="bg-theme-pink text-white px-4 py-2 rounded shadow-md" to="/admin/restaurants/details">Details</Link>
          <Link className="bg-white border px-4 py-2 rounded hover:bg-gray-100" to="/admin/restaurants/reviews">Reviews</Link>
          <Link className="bg-white border px-4 py-2 rounded hover:bg-gray-100" to="/admin/restaurants/admins">Admins</Link>
          <Link className="bg-white border px-4 py-2 rounded hover:bg-gray-100" to="/admin/restaurants/staff">Staff</Link>
        </div>
        <button onClick={() => setEditMode(!editMode)} className="flex items-center gap-1 text-sm bg-gray-100 border px-3 py-1 rounded">
          <PencilIcon className="w-4 h-4" />
          {editMode ? 'Finish Editing' : 'Edit'}
        </button>
      </div>

      {/* Restaurant Info */}
      <div className="flex flex-col sm:flex-row gap-10 items-center pb-10">
        <div className="flex flex-col gap-4">
          <div className="relative w-60 aspect-square rounded-full overflow-hidden border-4 border-theme-pink shadow-md flex-shrink-0">
            <img
              src={restaurant.image}
              alt="Restaurant"
              className="w-full h-full object-cover"
            />
          </div>

          {editMode && (
            <label className="block mt-4 w-60 bg-theme-pink text-white text-xs font-semibold px-3 py-2 rounded-full shadow-md cursor-pointer hover:bg-theme-pink-dark transition-all duration-300 text-center">
              <input
                type="file"
                className="hidden"
                onChange={() => alert("Upload not implemented")}
              />
              <span className="flex items-center space-x-1 justify-center">
                <CameraIcon className="w-4 h-4" /> {/* Use the HeroIcon here */}
                <span>Change</span>
              </span>
            </label>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full max-w-2xl">
        {editMode ? (
          <>
            <input
              value={restaurant.name}
              onChange={(e) => setRestaurant({ ...restaurant, name: e.target.value })}
              className="text-xl font-bold border p-1 rounded"
            />
            <textarea
              value={restaurant.description}
              onChange={(e) => setRestaurant({ ...restaurant, description: e.target.value })}
              className="border p-1 rounded"
            />
            <input
              value={restaurant.phone}
              onChange={(e) => setRestaurant({ ...restaurant, phone: e.target.value })}
              className="border p-1 rounded"
            />
            <div className="flex gap-2 items-center">
              <label className="text-sm">Hours:</label>
              <input
                type="time"
                value={restaurant.startTime}
                onChange={(e) => setRestaurant({ ...restaurant, startTime: e.target.value })}
                className="border p-1 rounded"
              />
              <span>-</span>
              <input
                type="time"
                value={restaurant.endTime}
                onChange={(e) => setRestaurant({ ...restaurant, endTime: e.target.value })}
                className="border p-1 rounded"
              />
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-theme-pink">{restaurant.name}</h1>
            <p className="text-sm italic text-gray-700">{restaurant.description}</p>
            <p><strong>Location:</strong> {restaurant.location}</p>
            <p>
              <strong>Operating Hours:</strong> {restaurant.startTime} - {restaurant.endTime}
            </p>
            <p><strong>Phone:</strong> {restaurant.phone}</p>
          </>
        )}

          {/* Cuisines */}
          <div>
            <strong>Cuisines:</strong>
            <div className="flex flex-wrap gap-2 mt-1">
              {restaurant.cuisines.map((cuisine, i) => (
                <div
                  key={i}
                  className="bg-theme-pink/10 text-theme-pink px-2 py-1 rounded flex items-center gap-1 text-sm"
                >
                  {cuisine}
                  {editMode && (
                    <button onClick={() => handleCuisineRemove(i)} className="text-red-500">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {editMode && (
                <div className="flex items-center gap-1">
                  <select
                    className="border p-1 text-sm rounded"
                    value={newCuisine}
                    onChange={(e) => setNewCuisine(e.target.value)}
                  >
                    <option value="">Choose Cuisine</option>
                    {[
                      "Pakistani",
                      "Indian",
                      "Chinese",
                      "Italian",
                      "BBQ",
                      "Fast Food",
                      "Desserts",
                      "Continental",
                      "Middle Eastern",
                      "Thai",
                      "Other",
                    ]
                      .filter((c) => !restaurant.cuisines.includes(c)) // prevent duplicates
                      .map((cuisine, idx) => (
                        <option key={idx} value={cuisine}>
                          {cuisine}
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
        <h2 className="text-2xl font-semibold text-theme-pink mb-4">Restaurant Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Reservations", value: restaurant.totalReservations },
            { label: "Avg. Rating", value: restaurant.avgRating, icon: <StarIcon className="w-5 h-5 text-yellow-500 inline" /> },
            { label: "Reviews", value: restaurant.reviewCount },
            { label: "Revenue", value: `$${restaurant.totalRevenue}` },
            { label: "Admins", value: restaurant.adminCount },
            { label: "Staff", value: restaurant.staffCount },
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
          {restaurant.tables.map((table, i) => (
            <div key={i} className="border rounded-lg p-4 bg-white shadow relative">
              <p><strong>Table</strong></p>
              <p>Seats: {table.capacity}</p>
              <p>Description: {table.description}</p>
              {editMode && (
                <button onClick={() => handleTableRemove(i)} className="absolute top-1 right-1 text-red-500">
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          {editMode && (
            <div className="border-dashed border-2 rounded-lg p-4 flex flex-col gap-2 justify-center items-center text-sm">
              <input placeholder="Capacity" className="border p-1 w-full rounded" value={newTable.capacity} onChange={(e) => setNewTable({ ...newTable, capacity: e.target.value })} />
              <input placeholder="Description" className="border p-1 w-full rounded" value={newTable.description} onChange={(e) => setNewTable({ ...newTable, description: e.target.value })} />
              <button onClick={handleTableAdd} className="text-theme-pink"><PlusIcon className="w-5 h-5" /></button>
            </div>
          )}
        </div>
      </div>
      {/* Restaurant Images Section */}
      <div className="pb-16 mt-16">
        <h2 className="text-2xl font-semibold text-theme-pink mb-4">Restaurant Images</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {restaurant.galleryImages.map((src, i) => (
          <div key={i} className="relative group">
            <img
              src={src}
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
              className="hidden"
              onChange={() => alert("Upload not implemented")}
            />
          </label>
        )}
      </div>
      </div>
    </div>
  );
}