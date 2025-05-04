import React from "react";
import { Link } from "react-router-dom";

const ReservationPayment = () => {
  const restaurantName = "The Spice Route";
  const reservationDate = "2025-05-06";
  const selectedTime = "12:00 PM";
  const specialRequest =
    "Please provide a high chair for my toddler and a quiet corrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr which theyll love and comfy";
  const tableDetails = {
    capacity: 6,
    description: "Perfect for group dining.",
    payment: "$25",
  };

  const handleConfirm = () => {
    // Handle reservation confirmation logic here
    console.log("Reservation Confirmed!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-theme-pink mb-6">{restaurantName}</h1>

      {/* Reservation Summary */}
      <div className="w-full max-w-md bg-white p-6 rounded shadow-md space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Reservation Summary</h2>

        {/* Reservation Details */}
        <div className="space-y-2">
          <p className="text-gray-700"><strong>Date:</strong> {reservationDate}</p>
          <p className="text-gray-700"><strong>Time:</strong> {selectedTime}</p>
          <p className="text-gray-700"><strong>Table Capacity:</strong> {tableDetails.capacity} seats</p>
          <p className="text-gray-700"><strong>Table Description:</strong> {tableDetails.description}</p>
        </div>

        {/* Special Request */}
        <div className="space-y-2">
          <p className="text-gray-700"><strong>Special Requests:</strong></p>
          <div className="max-h-24 overflow-y-auto p-2 bg-gray-100 rounded text-gray-700 whitespace-pre-wrap">
            {specialRequest || "None"}
          </div>
        </div>

        {/* Payment */}
        <div className="space-y-2">
          <p className="text-gray-700"><strong>Reservation Payment:</strong> {tableDetails.payment}</p>
        </div>

        {/* Confirm Button */}
        <div className="mt-8">
          <Link
            to="/customer/reservations"
            className="w-full py-3 flex items-center justify-center bg-theme-pink text-white font-semibold rounded hover:bg-pink-600 transition duration-200"
            onClick={handleConfirm}
          >
            Confirm Reservation
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReservationPayment;
