import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

const RestaurantDetails = () => {
  const [liked, setLiked] = useState(false);

  const restaurant = {
    name: 'The Spice Route',
    description: 'An exotic blend of traditional and modern Asian cuisine.',
    location: '123 Food Street, Karachi',
    cuisines: ['Thai', 'Indian', 'Chinese'],
    phone: '+92 300 1234567',
    hours: '11:00 AM - 11:00 PM',
    rating: 4.7,
    image: 'https://source.unsplash.com/300x300/?restaurant',
    headerImage: 'https://source.unsplash.com/1600x400/?restaurant-interior',
    totalReservations: 120,
    avgRating: 4.7,
    reviewCount: 85,
    totalRevenue: 12000,
    adminCount: 3,
    staffCount: 15,
  };

  const getStarRating = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      const fillPercentage = Math.min(Math.max(rating - i, 0), 1) * 100;
      stars.push(
        <div key={i} className="relative w-6 h-6">
          <StarSolid className="absolute text-gray-300" />
          <StarSolid
            className="absolute text-yellow-500"
            style={{ clipPath: `inset(0 ${100 - fillPercentage}% 0 0)` }}
          />
        </div>
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 text-theme-brown relative">
      {/* Navigation Buttons */}
      <div className="flex gap-4 p-6">
        <Link
          className="bg-theme-pink text-white px-4 py-2 rounded shadow-md"
          to="/admin/restaurants/details"
        >
          Details
        </Link>
        <Link
          className="bg-white border px-4 py-2 rounded hover:bg-gray-100"
          to="/admin/restaurants/reviews"
        >
          Reviews
        </Link>
        <Link
          className="bg-white border px-4 py-2 rounded hover:bg-gray-100"
          to="/admin/restaurants/admins"
        >
          Admins
        </Link>
        <Link
          className="bg-white border px-4 py-2 rounded hover:bg-gray-100"
          to="/admin/restaurants/staff"
        >
          Staff
        </Link>
      </div>

      {/* Restaurant Info Section */}
      <div className="flex flex-row gap-10 items-center px-6 pb-10 mt-16 relative">
        <div className="w-60 aspect-square rounded-full overflow-hidden border-4 border-theme-pink shadow-md flex-shrink-0">
          <img src={restaurant.image} alt="Restaurant" className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col gap-2 w-full max-w-2xl relative">
          <h1 className="text-3xl font-bold text-theme-pink">{restaurant.name}</h1>
          <p className="text-sm text-gray-700 italic">{restaurant.description}</p>
          <p><strong>Location:</strong> {restaurant.location}</p>
          <p><strong>Cuisines:</strong> {restaurant.cuisines.join(', ')}</p>
          <p><strong>Operating Hours:</strong> {restaurant.hours}</p>
          <p><strong>Phone:</strong> {restaurant.phone}</p>
        </div>
      </div>

      {/* Restaurant Info Report */}
      <div className="px-6 pb-16 mt-16 bg-white rounded-lg p-8">
        <h2 className="text-3xl font-semibold text-theme-pink mb-6">Restaurant Info Report</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Total Reservations */}
          <div className="bg-gray-100 rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Total Reservations</h3>
            <p className="text-2xl font-semibold text-theme-pink">{restaurant.totalReservations}</p>
          </div>
          
          {/* Average Rating */}
          <div className="bg-gray-100 rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Average Rating</h3>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-semibold text-yellow-500">{restaurant.avgRating}</span>
              <div className="flex gap-1">{getStarRating(restaurant.avgRating)}</div>
            </div>
          </div>

          {/* Review Count */}
          <div className="bg-gray-100 rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Review Count</h3>
            <p className="text-2xl font-semibold text-theme-pink">{restaurant.reviewCount}</p>
          </div>

          {/* Total Revenue */}
          <div className="bg-gray-100 rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Total Revenue</h3>
            <p className="text-2xl font-semibold text-theme-pink">${restaurant.totalRevenue}</p>
          </div>

          {/* Admin Count */}
          <div className="bg-gray-100 rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Admins Count</h3>
            <p className="text-2xl font-semibold text-theme-pink">{restaurant.adminCount}</p>
          </div>

          {/* Staff Count */}
          <div className="bg-gray-100 rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Staff Count</h3>
            <p className="text-2xl font-semibold text-theme-pink">{restaurant.staffCount}</p>
          </div>
        </div>
      </div>

      {/* Restaurant Images Section */}
      <div className="px-6 pb-16 mt-16">
        <h2 className="text-2xl font-semibold text-theme-pink mb-4">Restaurant Images</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <img
              key={i}
              src={`https://source.unsplash.com/400x300/?restaurant,food,${i}`}
              alt={`Restaurant view ${i}`}
              className="w-full h-48 object-cover rounded-lg shadow-sm"
            />
          ))}
        </div>
      </div>

      {/* Reserve Button - Bottom Right */}
      <div className="fixed bottom-6 right-6">
        <Link 
          className="bg-theme-pink text-white px-6 py-3 rounded-full shadow-lg hover:bg-pink-600"
          to="/customer/restaurants/reserve"
        >
          Reserve
        </Link>
      </div>
    </div>
  );
};

export default RestaurantDetails;
