import React, { useState } from 'react';
import { Link } from "react-router-dom";

const RestaurantReservation = () => {
  const restaurantName = "The Spice Route";

  const tables = [
    { id: 1, capacity: 2, description: "Cozy table for two by the window.", available: true },
    { id: 2, capacity: 4, description: "Spacious table for a small family.", available: false },
    { id: 3, capacity: 6, description: "Perfect for group dining.", available: true },
    { id: 4, capacity: 8, description: "Ideal for a larger party.", available: false },
    { id: 5, capacity: 2, description: "Private corner table.", available: true },
  ];

  const [filter, setFilter] = useState({ capacity: "", availability: "" });

  const handleFilterChange = (key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const filteredTables = tables.filter((table) => {
    const matchesCapacity =
      filter.capacity === "" || table.capacity.toString() === filter.capacity;
    const matchesAvailability =
      filter.availability === "" ||
      (filter.availability === "available" && table.available) ||
      (filter.availability === "unavailable" && !table.available);
    return matchesCapacity && matchesAvailability;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      {/* Navigation Buttons */}
      <div className="fixed top-6 left--1 flex gap-4 z-10">
        <Link
          className="bg-white border px-4 py-2 rounded hover:bg-gray-100"
          to="/customer/restaurants/details"
        >
          Details
        </Link>
        <Link
          className="bg-theme-pink text-white px-4 py-2 rounded shadow-md"
          to="/customer/restaurants/reserve"
        >
          Reserve
        </Link>
        <Link
          className="bg-white border px-4 py-2 rounded hover:bg-gray-100"
          to="/customer/restaurants/reviews"
        >
          Reviews
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-theme-pink text-center mb-8 pt-20">
        Reservations at {restaurantName}
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Filter by Capacity
          </label>
          <select
            className="border rounded px-3 py-2 w-40"
            value={filter.capacity}
            onChange={(e) => handleFilterChange("capacity", e.target.value)}
          >
            <option value="">All</option>
            {[...new Set(tables.map((table) => table.capacity))].map((capacity) => (
              <option key={capacity} value={capacity}>
                {capacity} Seats
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Filter by Availability
          </label>
          <select
            className="border rounded px-3 py-2 w-40"
            value={filter.availability}
            onChange={(e) => handleFilterChange("availability", e.target.value)}
          >
            <option value="">All</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
      </div>

      {/* Table List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTables.map((table) => (
          <div
            key={table.id}
            className="p-4 rounded shadow-md border border-gray-200"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Table {table.id}</h2>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Capacity:</strong> {table.capacity} seats
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Description:</strong> {table.description}
            </p>
            <p className="text-sm text-gray-600 mb-3">
              <strong>Status:</strong> {table.available ? "Available" : "Unavailable"}
            </p>
            <div
              className={`w-full text-white rounded flex justify-center items-center ${
                table.available
                  ? "bg-theme-pink hover:bg-pink-600"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {table.available ? (
                <Link
                  to="/customer/reservations/confirmation"
                  className="w-full h-full py-2 flex justify-center items-center"
                >
                  Reserve
                </Link>
              ) : (
                <span className="w-full h-full py-2 flex justify-center items-center">
                  Unavailable
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantReservation