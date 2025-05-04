import React, { useState } from "react";
import { Link

 } from "react-router-dom";
const PastReservations = () => {
  const [filter, setFilter] = useState("All"); // State for the selected filter
  const [reservations, setReservations] = useState([
    {
      id: 1,
      restaurant: "The Spice Route",
      date: "2025-04-15",
      time: "7:00 PM",
      people: 4,
      status: "Completed",
    },
    {
      id: 2,
      restaurant: "Cafe Mocha",
      date: "2025-04-18",
      time: "1:30 PM",
      people: 2,
      status: "Cancelled",
    },
    {
      id: 3,
      restaurant: "Sushi World",
      date: "2025-04-20",
      time: "8:00 PM",
      people: 3,
      status: "Completed",
    },
  ]);

  // Filter reservations based on the selected filter
  const filteredReservations =
    filter === "All"
      ? reservations
      : reservations.filter((reservation) => reservation.status === filter);

  return (
    <div classname="h-screen">
      <div className="text-4xl text-theme-pink p-7 font-bold border-b">
      Reservations
      </div>
      <div className="h-full bg-gray-50 p-6 flex flex-col items-start">
        {/* Navigation Buttons */}
        <div className="w-full max-w-6xl mb-6 flex space-x-4">
          <Link to="/customer/reservations" className="py-2 px-5 bg-gray-300 text-gray-800 text-base font-semibold rounded hover:bg-gray-400 transition duration-200">
            Current Reservations
          </Link>
          <Link to="/customer/reservations/past" className="py-2 px-5 bg-theme-pink text-white text-base font-semibold rounded">
            Past Reservations
          </Link>
        </div>

        {/* Heading */}
        <div className="w-full max-w-6xl mb-4">
          <h2 className="text-xl font-bold text-theme-pink mb-2 mt-6">
            Your Past Reservations
          </h2>
        </div>

        {/* Filter Dropdown */}
        <div className="w-full max-w-6xl mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="py-2 px-4 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-theme-pink"
          >
            <option value="All">Filter by: All</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Reservations List */}
        <div className="w-full max-w-6xl">
          <div className="space-y-6">
            {filteredReservations.map((reservation) => (
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
                        reservation.status === "Completed"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {reservation.status}
                    </p>
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

export default PastReservations;
