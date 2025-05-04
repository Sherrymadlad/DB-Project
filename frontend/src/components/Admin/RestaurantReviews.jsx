import React, { useState } from "react";
import { Link } from "react-router-dom";
import { StarIcon } from "@heroicons/react/24/solid";

const StarRating = ({ rating }) => {
  return (
    <div className="flex justify-center items-center">
      {[...Array(5)].map((_, i) => {
        const fillPercentage = Math.min(Math.max(rating - i, 0), 1) * 100;
        return (
          <div key={i} className="relative w-6 h-6">
            <StarIcon className="absolute text-gray-300" />
            <StarIcon
              className="absolute text-yellow-500"
              style={{ clipPath: `inset(0 ${100 - fillPercentage}% 0 0)` }}
            />
          </div>
        );
      })}
    </div>
  );
};

const RestaurantReviews = () => {
  const [selectedStars, setSelectedStars] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([
    { name: "Ali", stars: 4, comment: "Great food!" },
    { name: "Sara", stars: 2, comment: "Not impressed." },
    { name: "Zain", stars: 5, comment: "Absolutely amazing!" },
    { name: "Fatima", stars: 3, comment: "It was okay." },
  ]);
  const [sortOrder, setSortOrder] = useState("desc");
  const averageRating = 3.7;

  const sortedReviews = [...reviews].sort((a, b) =>
    sortOrder === "asc" ? a.stars - b.stars : b.stars - a.stars
  );

  return (
    <div className="min-h-screen w-full text-theme-brown relative p-6">
      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <Link
          className="bg-white border px-4 py-2 rounded hover:bg-gray-100"
          to="/admin/restaurants/details"
        >
          Details
        </Link>
        <Link
          className="bg-theme-pink text-white px-4 py-2 rounded shadow-md"
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

      <h1 className="text-3xl font-bold text-center text-theme-pink mb-6">
        The Spice Route
      </h1>

      <div className="text-center mb-6">
        <StarRating rating={averageRating} />
        <p className="text-gray-500 text-sm mt-1">Rated {averageRating} out of 5</p>
      </div>

      {/* Reviews Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-theme-pink">What others are saying</h2>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border text-sm rounded px-2 py-1"
        >
          <option value="desc">Sort by Highest Stars</option>
          <option value="asc">Sort by Lowest Stars</option>
        </select>
      </div>
      <div className="space-y-4">
        {sortedReviews.map((review, idx) => (
          <div key={idx} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{review.name}</span>
              <StarRating rating={review.stars} />
            </div>
            <p className="text-sm text-gray-700 break-words">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantReviews;