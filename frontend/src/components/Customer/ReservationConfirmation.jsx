import React, { useState } from "react";

const ReservationConfirmation = () => {
  const restaurantName = "The Spice Route";
  const [selectedTime, setSelectedTime] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");

  const handleNext = () => {
    // You can add navigation or other logic here later
    console.log("Reservation data:", { selectedTime, specialRequest });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-theme-pink mb-6">{restaurantName}</h1>

      {/* Time Selection */}
      <div className="w-full max-w-md mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Choose a Time</h2>
        <select
          className="w-full p-3 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-theme-pink"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
        >
          <option value="" disabled>Select a time</option>
          <option value="12:00 PM">12:00 PM</option>
          <option value="1:00 PM">1:00 PM</option>
          <option value="2:00 PM">2:00 PM</option>
          <option value="6:00 PM">6:00 PM</option>
          <option value="7:00 PM">7:00 PM</option>
          <option value="8:00 PM">8:00 PM</option>
        </select>
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
      <button
        className="w-full max-w-xs py-2 bg-theme-pink text-white font-semibold rounded hover:bg-pink-600 transition duration-200"
        onClick={handleNext}
      >
        Next
      </button>
    </div>
  );
};

export default ReservationConfirmation;
