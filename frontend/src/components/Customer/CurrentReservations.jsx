import React, { useState } from "react";
import { Link } from "react-router-dom";

const CurrentReservations = () => {
  const [reservations, setReservations] = useState([
    {
      id: 1,
      restaurant: "The Spice Route",
      date: "2025-05-10",
      time: "7:00 PM",
      people: 4,
      status: "Approved",
    },
    {
      id: 2,
      restaurant: "Cafe Mocha",
      date: "2025-05-12",
      time: "1:30 PM",
      people: 2,
      status: "Pending",
    },
    {
      id: 3,
      restaurant: "Sushi World",
      date: "2025-05-15",
      time: "8:00 PM",
      people: 3,
      status: "Approved",
    },
  ]);

  const [expandedId, setExpandedId] = useState(null);
  const [filterOption, setFilterOption] = useState("all");
  const [sortOption, setSortOption] = useState("time-asc");

  const toggleExpand = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const filteredReservations = reservations.filter((reservation) => {
    if (filterOption === "all") return true;
    return reservation.status.toLowerCase() === filterOption;
  });

  const sortedReservations = [...filteredReservations].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return sortOption === "time-asc" ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center text-theme-brown">
      {/* Navigation Buttons */}
      <div className="w-full max-w-6xl mb-6 flex space-x-4">
        <Link to="/customer/reservations" className="py-2 px-5 bg-theme-pink text-white text-base font-semibold rounded">
          Current Reservations
        </Link>
        <Link to="/customer/reservations/past" className="py-2 px-5 bg-gray-300 text-gray-800 text-base font-semibold rounded hover:bg-gray-400 transition duration-200">
          Past Reservations
        </Link>
      </div>

      {/* Heading and Controls */}
      <div className="w-full max-w-6xl mb-4">
        <h2 className="text-xl font-bold text-theme-pink mb-4 mt-6">Your Current Reservations</h2>
        <div className="flex justify-between items-center">
          {/* Filter Dropdown */}
          <select
            value={filterOption}
            onChange={handleFilterChange}
            className="py-2 px-4 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-theme-pink"
          >
            <option value="all">Filter by: All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="py-2 px-4 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-theme-pink"
          >
            <option value="time-asc">Sort by: Time Ascending</option>
            <option value="time-desc">Sort by: Time Descending</option>
          </select>
        </div>
      </div>

      {/* Reservations List */}
      <div className="w-full max-w-6xl">
        <div className="space-y-6">
          {sortedReservations.map((reservation) => (
            <div
              key={reservation.id}
              className="bg-white border border-gray-300 rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-center">
                {/* Reservation Details */}
                <div className="flex-1 flex justify-between items-center space-x-8">
                  <h3 className="text-lg font-bold text-gray-800 flex-shrink-0 w-1/4">
                    {reservation.restaurant}
                  </h3>
                  <p className="text-sm text-gray-600 flex-grow">
                    {reservation.date} at {reservation.time}
                  </p>
                  <p className="text-sm text-gray-600 w-1/4">
                    Party: {reservation.people}
                  </p>
                  <p
                    className={`text-sm font-semibold flex-shrink-0 w-1/5 ${
                      reservation.status === "Approved"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {reservation.status}
                  </p>
                </div>
                {/* Expand Button */}
                <button
                  onClick={() => toggleExpand(reservation.id)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  {expandedId === reservation.id ? "▲" : "▼"}
                </button>
              </div>

              {/* Expandable Panel */}
              {expandedId === reservation.id && (
                <div className="mt-4 space-y-2">
                  <button className="w-full py-3 px-4 bg-blue-500 text-white text-sm font-semibold rounded hover:bg-blue-600 transition duration-200">
                    Modify Reservation
                  </button>
                  <button className="w-full py-3 px-4 bg-red-500 text-white text-sm font-semibold rounded hover:bg-red-600 transition duration-200">
                    Delete Reservation
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrentReservations;
