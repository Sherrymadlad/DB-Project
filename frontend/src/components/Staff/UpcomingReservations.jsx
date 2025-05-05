import React, { useState } from "react";
import { Link } from "react-router-dom";

const UpcomingReservations = () => {
  const [reservations, setReservations] = useState([
    {
      id: 1,
      restaurant: "The Spice Route",
      date: "2025-05-05",
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
      date: "2025-05-05",
      time: "8:00 PM",
      people: 3,
      status: "Approved",
      user: "Usman Raza",
    },
  ]);

  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  const today = new Date().toISOString().split("T")[0];

  const filteredReservations = reservations.filter(
    (reservation) =>
      reservation.status.toLowerCase() === "approved" &&
      reservation.date === today
  );

  const markAsCompleted = (id) => {
    setReservations((prev) =>
      prev.map((res) =>
        res.id === id ? { ...res, status: "Completed" } : res
      )
    );
    setExpandedId(null);
  };

  return (
    <div className="h-screen">
      <div className="text-4xl text-theme-pink p-7 font-bold border-b">
        Reservations
      </div>
      <div className="h-full bg-gray-50 p-6 flex flex-col items-start text-theme-brown">
        {/* Navigation Buttons */}
        <div className="w-full max-w-6xl mb-6 flex space-x-4">
          <Link
            to="/staff/reservations"
            className="py-2 px-5 bg-gray-300 text-gray-800 text-base font-semibold rounded hover:bg-gray-400 transition duration-200"
          >
            All Reservations
          </Link>
          <Link
            to="/staff/reservations/upcoming"
            className="py-2 px-5 bg-theme-pink text-white text-base font-semibold rounded"
          >
            Upcoming Reservations
          </Link>
        </div>

        {/* Heading */}
        <div className="w-full max-w-6xl mb-4 mt-6">
          <h2 className="text-xl font-bold text-theme-pink mb-4">
            Approved Reservations for Today
          </h2>
        </div>

        {/* Reservations List */}
        <div className="w-full max-w-6xl">
          <div className="space-y-6">
            {filteredReservations.length === 0 ? (
              <div className="text-gray-600">No approved reservations today.</div>
            ) : (
              filteredReservations.map((reservation) => (
                <div
                  onClick={() => toggleExpand(reservation.id)}
                  key={reservation.id}
                  className="bg-white border border-gray-300 rounded-lg shadow-md p-6"
                >
                  <div className="grid grid-cols-6 gap-4 items-center">
                    <h3 className="text-lg font-bold text-gray-800 col-span-1 flex items-center justify-center">
                      {reservation.restaurant}
                    </h3>
                    <p className="text-sm text-gray-600 col-span-1 flex items-center justify-center">
                      {reservation.user}
                    </p>
                    <p className="text-sm text-gray-600 col-span-1 flex items-center justify-center">
                      {reservation.date}
                    </p>
                    <p className="text-sm text-gray-600 col-span-1 flex items-center justify-center">
                      {reservation.time}
                    </p>
                    <p className="text-sm text-gray-600 col-span-1 flex items-center justify-center">
                      Party: {reservation.people}
                    </p>
                    <div className="col-span-1 grid grid-cols-2 items-center gap-1">
                      <p className="text-sm font-semibold text-center text-green-600">
                        {reservation.status}
                      </p>
                      <button
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
                      expandedId === reservation.id
                        ? "max-h-40 opacity-100 mt-4"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="flex flex-row items-center justify-end gap-4">
                      <button
                        onClick={() => markAsCompleted(reservation.id)}
                        className="w-1/6 py-3 px-4 bg-theme-pink text-white text-sm font-semibold rounded hover:bg-pink-600 transition duration-200"
                      >
                        Mark as Completed
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingReservations;
