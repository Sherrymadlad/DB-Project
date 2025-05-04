import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

const RestaurantAdmins = () => {
  const [admins, setAdmins] = useState([
    {
      profilePic: "https://via.placeholder.com/100",
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "+1 234 567 8901",
    },
    {
      profilePic: "https://via.placeholder.com/100",
      name: "Jane Smith",
      email: "janesmith@example.com",
      phone: "+1 987 654 3210",
    },
    {
      profilePic: "https://via.placeholder.com/100",
      name: "Michael Brown",
      email: "michaelbrown@example.com",
      phone: "+1 555 666 7777",
    },
  ]);

  const [showPanel, setShowPanel] = useState(false);
  const [newName, setNewName] = useState("");

  const handleDelete = (name) => {
    setAdmins((prev) => prev.filter((admin) => admin.name !== name));
  };

  const handleAddAdmin = () => {
    if (newName.trim()) {
      setAdmins((prev) => [
        ...prev,
        {
          profilePic: "https://via.placeholder.com/100",
          name: newName.trim(),
          email: "unknown@example.com",
          phone: "N/A",
        },
      ]);
      setNewName("");
      setShowPanel(false);
    }
  };

  return (
    <div className="h-screen flex flex-col relative">
      <div className="text-4xl text-theme-pink p-7 font-bold border-b">
        All Employees
      </div>
      <div className="min-h-screen bg-gray-50 p-6 pb-20">
        {/* Top Buttons */}
        <div className="mb-6 flex space-x-4">
          <Link
            to="/restaurant-admins/all"
            className="py-2 px-5 bg-theme-pink text-white text-base font-semibold rounded hover:bg-pink-600 transition duration-200"
          >
            All Admins
          </Link>
          <Link
            to="/restaurant-admins/all-staff"
            className="py-2 px-5 bg-gray-300 text-gray-800 text-base font-semibold rounded hover:bg-gray-400 transition duration-200"
          >
            All Staff
          </Link>
        </div>

        {/* Admins List */}
        <div className="space-y-3">
          {admins.map((admin, index) => (
            <div
              key={index}
              className="p-3 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition duration-200 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={admin.profilePic}
                  alt={`${admin.name}'s Profile`}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex flex-col sm:flex-row sm:space-x-20 text-sm sm:text-base">
                  <span className="font-semibold text-gray-800 min-w-[250px] ml-4">
                    {admin.name}
                  </span>
                  <span className="text-gray-600 min-w-[350px]">{admin.email}</span>
                  <span className="text-gray-600 min-w-[250px]">{admin.phone}</span>
                </div>
              </div>

              <button
                onClick={() => handleDelete(admin.name)}
                className="text-red-500 hover:text-red-700 transition"
                title="Delete Admin"
              >
                <TrashIcon className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowPanel(true)}
        className="fixed bottom-6 right-6 bg-theme-pink hover:bg-pink-600 text-white p-4 rounded-full shadow-lg transition duration-200 z-50"
        title="Add Admin"
      >
        <PlusIcon className="w-6 h-6" />
      </button>

      {/* Top-Aligned Panel */}
      {showPanel && (
  <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 shadow-2xl rounded-lg z-50 w-full max-w-md p-6">
    <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">Add New Admin</h2>
    <input
      type="text"
      placeholder="Enter admin name"
      value={newName}
      onChange={(e) => setNewName(e.target.value)}
      className="border border-gray-300 rounded px-4 py-2 w-full mb-4"
    />
    <div className="flex justify-end space-x-2">
      <button
        onClick={handleAddAdmin}
        className="bg-theme-pink text-white px-4 py-2 rounded hover:bg-pink-600 transition"
      >
        Add
      </button>
      <button
        onClick={() => setShowPanel(false)}
        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
      >
        Cancel
      </button>
    </div>
  </div>
)}


    </div>
  );
};

export default RestaurantAdmins;
