import React, { useState } from "react";
import { Link } from "react-router-dom";

const Reservations = () => {
  const [reservations, setReservations] = useState([
    {
      id: 1,
      restaurant: "The Spice Route",
      date: "2025-05-10",
      time: "7:00 PM",
      people: 4,
      status: "Approved",
      user: "Ali Khan",
    },
    {
      id: 2,
      restaurant: "Cafe Mocha",
      date: "2025-05-12",
      time: "1:30 PM",
      people: 2,
      status: "Pending",
      user: "Sara Ahmed",
    },
    {
      id: 3,
      restaurant: "Sushi World",
      date: "2025-05-15",
      time: "8:00 PM",
      people: 3,
      status: "Approved",
      user: "Usman Raza",
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
    <div classname="h-screen">
      <div className="text-4xl text-theme-pink p-7 font-bold border-b">
        Reservations
      </div>
      <div className="h-full bg-gray-50 p-6 flex flex-col items-start text-theme-brown">
      
        {/* Navigation Buttons */}
        <div className="w-full max-w-6xl mb-6 flex space-x-4">
          <Link to="/staff/reservations" className="py-2 px-5 bg-theme-pink text-white text-base font-semibold rounded">
            All Reservations
          </Link>
          <Link to="/staff/reservations/upcoming" className="py-2 px-5 bg-gray-300 text-gray-800 text-base font-semibold rounded hover:bg-gray-400 transition duration-200">
            Upcoming Reservations
          </Link>
        </div>

        {/* Heading and Controls */}
        <div className="w-full max-w-6xl mb-4 mt-6">
          <h2 className="text-xl font-bold text-theme-pink mb-4">Your Current Reservations</h2>
          <div className="flex justify-between items-center">
            {/* Filter Dropdown */}
            <div className="flex flex-col gap-1">
                <div className="text-gray-500 text-sm">Filter By:</div>
                <select
                value={filterOption}
                onChange={handleFilterChange}
                className="py-2 px-4 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-theme-pink"
                >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex flex-col gap-1">
                <div className="text-gray-500 text-sm">Sort By:</div>
                <select
                value={sortOption}
                onChange={handleSortChange}
                className="py-2 px-4 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-theme-pink"
                >
                <option value="time-asc">Time Ascending</option>
                <option value="time-desc">Time Descending</option>
                </select>
            </div>
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
              <div className="grid grid-cols-6 gap-4 items-center">
                {/* Restaurant Name */}
                <h3 className="text-lg font-bold text-gray-800 col-span-1 flex items-center justify-center">
                  {reservation.restaurant}
                </h3>

                {/* User Name */}
                <p className="text-sm text-gray-600 col-span-1 flex items-center justify-center">
                  {reservation.user}
                </p>

                {/* Date and Time */}
                <p className="text-sm text-gray-600 col-span-1 flex items-center justify-center">
                  {reservation.date}
                </p>

                <p className="text-sm text-gray-600 col-span-1 flex items-center justify-center">
                  {reservation.time}
                </p>


                {/* Party Size */}
                <p className="text-sm text-gray-600 col-span-1 flex items-center justify-center">
                  Party: {reservation.people}
                </p>

                {/* Status + Expand Button */}
                <div className="col-span-1 grid grid-cols-2 items-center gap-1">
                  <p
                    className={`text-sm font-semibold text-center ${
                      reservation.status === "Approved"
                        ? "text-green-600"
                        : reservation.status === "Completed"
                        ? "text-theme-pink"
                        : reservation.status === "Cancelled"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {reservation.status}
                  </p>

                  <button
                    onClick={() => toggleExpand(reservation.id)}
                    className={`transition-transform duration-300 text-gray-600 hover:text-gray-800 justify-self-end ${
                      expandedId === reservation.id ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    ▼
                  </button>
                </div>
              </div>
            
              {/* Expandable Panel */}
              <div
                className={`transition-all duration-500 overflow-hidden ${
                  expandedId === reservation.id ? "max-h-40 opacity-100 mt-4" : "max-h-0 opacity-0"
                }`}
              >
                <div className="flex flex-row items-center justify-end gap-4">
                  <button className="w-1/6 py-3 px-4 bg-theme-pink text-white text-sm font-semibold rounded hover:bg-pink-600 transition duration-200">
                    Accept
                  </button>
                  <button className="w-1/6 py-3 px-4 bg-red-500 text-white text-sm font-semibold rounded hover:bg-red-600 transition duration-200">
                    Reject
                  </button>
                </div>
              </div>
            </div>
            
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservations;
