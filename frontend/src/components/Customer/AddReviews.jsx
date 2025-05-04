import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const AddReviews = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants] = useState([
    { name: "The Spice Route", rating: 4.5 },
    { name: "Cafe Mocha", rating: 4.2 },
    { name: "Pasta Palace", rating: 4.0 },
    { name: "SuAddld", rating: 4.8 },
    { name: "Burger Hub", rating: 3.9 },
    { name: "Taco Town", rating: 4.3 },
  ]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const RestaurantCard = ({ restaurant }) => (
    <Link
      to="/customer/restaurants/details"
      className="p-4 bg-white border border-gray-300 rounded-xl shadow-lg hover:shadow-xl transition duration-300 flex items-center"
    >
      {/* Image Placeholder */}
      <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mr-6">
        <span className="text-sm text-gray-500">Image</span>
      </div>
      {/* Restaurant Information */}
      <div className="flex-grow">
        <h3 className="text-lg font-bold text-gray-800">{restaurant.name}</h3>
        <div className="mt-2 flex items-center space-x-2">
          <span className="text-yellow-500 text-lg">⭐</span>
          <span className="text-md font-semibold text-gray-800">
            {restaurant.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  );

  return (
    <div classname="h-screen">
    <div className="text-4xl text-theme-pink p-7 font-bold border-b">
     Reservations
   </div>
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      {/* Buttons */}
      <div className="w-full max-w-6xl mb-6 flex justify-start space-x-4">
        <Link
          to="/customer/reviews"
          className="py-2 px-5 bg-theme-pink text-white text-base font-semibold rounded hover:bg-pink-600 transition duration-200"
        >
          Add Review
        </Link>
        <Link
          to="/customer/reviews/past"
          className="py-2 px-5 bg-gray-300 text-gray-800 text-base font-semibold rounded hover:bg-gray-400 transition duration-200"
        >
          Past Reviews
        </Link>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-6xl mt-12 mb-8 relative">
        <div className="w-full flex items-center bg-white border border-gray-300 rounded-full shadow-sm">
          <MagnifyingGlassIcon className="h-6 w-6 text-gray-400 absolute left-4" />
          <input
            type="text"
            placeholder="Search restaurant to review"
            className="w-full p-4 pl-12 text-lg bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-theme-pink"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {restaurants
          .filter((restaurant) =>
            restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((restaurant, index) => (
            <RestaurantCard key={index} restaurant={restaurant} />
          ))}
      </div>
    </div>
    </div>
  );
};

export default AddReviews;
