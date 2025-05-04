import React, { useState } from "react";
import { Link } from "react-router-dom";

const PastReviews = () => {
  const [sortOrder, setSortOrder] = useState("desc");

  const reviews = [
    { restaurant: "The Spice Route", stars: 4, comment: "Amazing flavors and service!" },
    { restaurant: "Sushi World", stars: 5, comment: "Best sushi I’ve had in ages." },
    { restaurant: "Burger Hub", stars: 3, comment: "Good but a bit greasy." },
  ];

  const sortedReviews = [...reviews].sort((a, b) =>
    sortOrder === "asc" ? a.stars - b.stars : b.stars - a.stars
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Buttons */}
      <div className="mb-6 flex space-x-4">
        <Link to="/customer/reviews" className="py-2 px-5 bg-gray-300 text-gray-800 text-base font-semibold rounded hover:bg-gray-400 transition duration-200">
          Add Review
        </Link>
        <Link to="/customer/reviews/past" className="py-2 px-5 bg-theme-pink text-white text-base font-semibold rounded hover:bg-pink-600 transition duration-200">
          Past Reviews
        </Link>
      </div>

      {/* Sort Dropdown */}
      <div className="mb-4">
        <label htmlFor="sort" className="mr-2 text-gray-700 font-medium">
          Sort by Stars:
        </label>
        <select
          id="sort"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-theme-pink"
        >
          <option value="desc">Highest First</option>
          <option value="asc">Lowest First</option>
        </select>
      </div>

      {/* Review List */}
      <div className="grid gap-6">
        {sortedReviews.map((review, index) => (
          <div
            key={index}
            className="p-6 bg-white border border-gray-300 rounded-lg shadow-md"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {review.restaurant}
            </h3>
            <p className="text-yellow-500 text-sm mt-1">
              {"★".repeat(review.stars) + "☆".repeat(5 - review.stars)}
            </p>
            <p className="mt-2 text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastReviews;
