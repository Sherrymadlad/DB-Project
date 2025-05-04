import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

const RestaurantStaff = () => {
  const [staffMembers, setStaffMembers] = useState([
    {
      profilePic: "https://via.placeholder.com/100",
      name: "Alice Johnson",
      email: "alicejohnson@example.com",
      phone: "+1 222 333 4444",
    },
    {
      profilePic: "https://via.placeholder.com/100",
      name: "Bob Taylor",
      email: "bobtaylor@example.com",
      phone: "+1 777 888 9999",
    },
    {
      profilePic: "https://via.placeholder.com/100",
      name: "Catherine Green",
      email: "catherinegreen@example.com",
      phone: "+1 111 222 3333",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");

  const handleDelete = (name) => {
    console.log(`Delete clicked for: ${name}`);
    setStaffMembers((prev) => prev.filter((s) => s.name !== name));
  };

  const handleAddStaff = () => {
    if (newName.trim() === "") return;
    setStaffMembers([
      ...staffMembers,
      {
        profilePic: "https://via.placeholder.com/100",
        name: newName,
        email: "newstaff@example.com",
        phone: "+1 000 000 0000",
      },
    ]);
    setNewName("");
    setShowModal(false);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 text-theme-brown relative">
      {/* Navigation Buttons */}
      <div className="flex gap-4 p-6">
        <Link
          className="bg-white border px-4 py-2 rounded shadow-md hover:bg-gray-100"
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
          className="bg-theme-pink text-white px-4 py-2 rounded"
          to="/admin/restaurants/staff"
        >
          Staff
        </Link>
      </div>

      {/* All Staff Heading */}
      <h2 className="text-2xl font-semibold text-theme-pink px-6 mt-6">All Staff</h2>

      {/* Staff List */}
      <div className="space-y-3 p-6">
        {staffMembers.map((staff, index) => (
          <div
            key={index}
            className="p-3 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition duration-200 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <img
                src={staff.profilePic}
                alt={`${staff.name}'s Profile`}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex flex-col sm:flex-row sm:space-x-20 text-sm sm:text-base">
                <span className="font-semibold text-gray-800 min-w-[250px] ml-4">
                  {staff.name}
                </span>
                <span className="text-gray-600 min-w-[350px]">
                  {staff.email}
                </span>
                <span className="text-gray-600 min-w-[250px]">
                  {staff.phone}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleDelete(staff.name)}
              className="text-red-500 hover:text-red-700 transition"
              title="Delete Staff"
            >
              <TrashIcon className="w-6 h-6" />
            </button>
          </div>
        ))}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-theme-pink text-white p-4 rounded-full shadow-lg hover:bg-pink-600 transition z-40"
        title="Add Staff"
      >
        <PlusIcon className="h-6 w-6" />
      </button>

      {/* Centered Modal */}
      {showModal && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 shadow-2xl rounded-lg z-50 w-full max-w-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
            Add New Staff
          </h2>
          <input
            type="text"
            placeholder="Enter staff username"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full mb-4"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleAddStaff}
              className="bg-theme-pink text-white px-4 py-2 rounded hover:bg-pink-600 transition"
            >
              Add
            </button>
            <button
              onClick={() => setShowModal(false)}
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

export default RestaurantStaff;
