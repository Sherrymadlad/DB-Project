import React, { useState } from "react";

const Reviews = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState([
    { name: "The Spice Route", cuisine: "Indian" },
    { name: "Cafe Mocha", cuisine: "Continental" },
    { name: "Pasta Palace", cuisine: "Italian" },
    { name: "Sushi World", cuisine: "Japanese" },
    { name: "Burger Hub", cuisine: "American" },
    { name: "Taco Town", cuisine: "Mexican" },
  ]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      {/* Buttons */}
      <div className="w-full max-w-6xl mb-6 flex justify-start space-x-4">
        <button className="py-2 px-5 bg-theme-pink text-white text-base font-semibold rounded hover:bg-pink-600 transition duration-200">
          Add Review
        </button>
        <button className="py-2 px-5 bg-gray-300 text-gray-800 text-base font-semibold rounded hover:bg-gray-400 transition duration-200">
          Past Reviews
        </button>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-6xl mt-12 mb-8">
        <input
          type="text"
          placeholder="Search restaurant to review"
          className="w-full p-4 text-lg bg-white border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-theme-pink"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Restaurant Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {restaurants
          .filter((restaurant) =>
            restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((restaurant, index) => (
            <div
              key={index}
              className="p-8 h-40 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 transition duration-200 flex flex-col justify-center"
            >
              <h3 className="text-xl font-bold text-gray-800 text-center">
                {restaurant.name}
              </h3>
              <p className="text-md text-gray-600 mt-2 text-center">
                Cuisine: {restaurant.cuisine}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Reviews