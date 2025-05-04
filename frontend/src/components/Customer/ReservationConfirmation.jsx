import React, { useState } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ReservationConfirmation = () => {
  const restaurantName = "The Spice Route";
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [specialRequest, setSpecialRequest] = useState("");

  const handleNext = () => {
    if (!selectedDateTime) {
      alert("Please select a date and time.");
      return;
    }

    console.log("Reservation data:", {
      dateTime: selectedDateTime.toString(),
      specialRequest,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-theme-pink mb-6">{restaurantName}</h1>

      {/* Date & Time Picker */}
      <div className="w-full max-w-md mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Choose Date & Time</h2>
        <DatePicker
          selected={selectedDateTime}
          onChange={(date) => setSelectedDateTime(date)}
          showTimeSelect
          dateFormat="MMMM d, yyyy h:mm aa"
          placeholderText="Select date and time"
          className="w-full min-w-[450px] p-3 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-theme-pink"
        />
      </div>

      {/* Special Request Text Box */}
      <div className="w-full max-w-md mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Special Requests</h2>
        <textarea
          className="w-full p-3 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-theme-pink resize-none"
          rows="4"
          placeholder="Enter any special requests..."
          value={specialRequest}
          onChange={(e) => setSpecialRequest(e.target.value)}
        />
      </div>

      {/* Next Button */}
      <Link
        to="/customer/reservations/payment"
        className="w-full max-w-xs py-2 bg-theme-pink text-white flex items-center justify-center font-semibold rounded hover:bg-pink-600 transition duration-200"
        onClick={handleNext}
      >
        Next
      </Link>
    </div>
  );
};

export default ReservationConfirmation;
