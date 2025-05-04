import React, { useState } from "react";
import { Link } from "react-router-dom";

const Restaurants = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState([
    { name: "The Spice Route", cuisine: "Indian", rating: 4.5 },
    { name: "Cafe Mocha", cuisine: "Continental", rating: 4.2 },
    { name: "Pasta Palace", cuisine: "Italian", rating: 4.0 },
    { name: "Sushi World", cuisine: "Japanese", rating: 4.8 },
    { name: "Burger Hub", cuisine: "American", rating: 3.9 },
    { name: "Taco Town", cuisine: "Mexican", rating: 4.3 },
  ]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">

      {/* Search Bar */}
      <div className="w-full max-w-6xl mt-12 mb-8">
        <input
          type="text"
          placeholder="Search restaurant to reserve"
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
            <Link
              to = "/customer/restaurants/details"
              key={index}
              className="p-6 h-68 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 transition duration-200 flex flex-col items-center"
            >
              {/* Profile Picture Placeholder */}
              <div className="w-28 h-28 bg-gray-200 rounded-full mb-3 flex items-center justify-center text-gray-500">
                <span className="text-sm">Image</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 text-center">
                {restaurant.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1 text-center">
                Cuisine: {restaurant.cuisine}
              </p>
              {/* Star and Rating Positioned Downwards */}
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-yellow-500 text-lg">⭐</span>
                <span className="text-md font-semibold text-gray-800">
                  {restaurant.rating.toFixed(1)}
                </span>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Restaurants;
