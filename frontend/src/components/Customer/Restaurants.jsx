import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const Restaurants = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([
    { name: "Sushi World", cuisine: "Japanese", rating: 4.8 },
    { name: "The Spice Route", cuisine: "Indian", rating: 4.5 },
  ]);
  const [restaurants] = useState([
    { name: "Cafe Mocha", cuisine: "Continental", rating: 4.2 },
    { name: "Pasta Palace", cuisine: "Italian", rating: 4.0 },
    { name: "Burger Hub", cuisine: "American", rating: 3.9 },
    { name: "Taco Town", cuisine: "Mexican", rating: 4.3 },
    { name: "Tokyo Bites", cuisine: "Japanese", rating: 4.7 },
    { name: "Curry House", cuisine: "Indian", rating: 4.4 },
    { name: "Noodle Nirvana", cuisine: "Chinese", rating: 4.6 },
    { name: "Greek Taverna", cuisine: "Mediterranean", rating: 4.3 },
    { name: "Pizza Planet", cuisine: "Italian", rating: 4.1 },
  ]);

  const cuisines = ["Japanese", "Indian"];

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const filteredByCuisine = restaurants.filter((r) => cuisines.includes(r.cuisine));
  const remainingRestaurants = restaurants.filter(
    (r) =>
      !favorites.find((f) => f.name === r.name) &&
      !filteredByCuisine.find((f) => f.name === r.name)
  );

  const allRestaurants = [...favorites, ...filteredByCuisine, ...remainingRestaurants];

  const filteredRestaurants = allRestaurants.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const RestaurantCard = ({ restaurant }) => (
    <Link
      to="/customer/restaurants/details"
      className="p-4 bg-white border border-gray-300 rounded-xl shadow-lg hover:shadow-xl transition duration-300 flex items-center"
    >
      <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mr-6">
        <span className="text-sm text-gray-500">Image</span>
      </div>
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
    <div className="h-screen flex flex-col">
      {/* Heading */}
      <div className="text-4xl text-theme-pink p-7 font-bold border-b">
        Restaurants
      </div>
      {/* Content */}
      <div className="w-full h-full mx-auto p-8 bg-white text-theme-brown space-y-10 overflow-y-auto">
        {/* Search Bar */}
        <div className="w-full max-w-6xl relative mx-auto">
          <div className="w-full relative flex items-center border border-gray-300 rounded-full">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400 absolute left-4" />
            <input
              type="text"
              placeholder="Search restaurant to reserve"
              className="w-full p-4 pl-12 text-lg bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-theme-pink"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Main Sections */}
        {searchQuery ? (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-theme-pink mb-4">Search Results</h2>
            <div className="border-b-2 border-pink-500 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {filteredRestaurants.map((restaurant, index) => (
                <RestaurantCard key={index} restaurant={restaurant} />
              ))}
            </div>
          </div>
        ) : (
          <>
            {favorites.length > 0 && (
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-theme-pink mb-4">Your Faves</h2>
                <div className="border-b-2 border-pink-500 mb-8"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {favorites.map((restaurant, index) => (
                    <RestaurantCard key={index} restaurant={restaurant} />
                  ))}
                </div>
              </div>
            )}

            {filteredByCuisine.length > 0 && (
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-theme-pink mb-4">
                  Restaurants That Offer Your Cuisines
                </h2>
                <div className="border-b-2 border-pink-500 mb-8"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {filteredByCuisine.map((restaurant, index) => (
                    <RestaurantCard key={index} restaurant={restaurant} />
                  ))}
                </div>
              </div>
            )}

            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-pink-500">All Restaurants</h2>
                <div className="flex space-x-4">
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-theme-pink focus:border-theme-pink">
                    <option>Sort by</option>
                    <option>Highest Rated</option>
                    <option>Lowest Rated</option>
                  </select>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-theme-pink focus:border-theme-pink">
                    <option>All</option>
                    <option>Nearest to You</option>
                  </select>
                </div>
              </div>
              <div className="border-b-2 border-pink-500 mb-8"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {remainingRestaurants.map((restaurant, index) => (
                  <RestaurantCard key={index} restaurant={restaurant} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Restaurants;
