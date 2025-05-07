import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const PastReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const fetchReviews = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const res = await axios.get(
          `http://localhost:5000/api/reviews-user/${userId}`
        );
        setReviews(res.data.data);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };

    fetchReviews();
  }, []);

  const sortedReviews = [...reviews].sort((a, b) =>
    sortOrder === "asc" ? a.Rating - b.Rating : b.Rating - a.Rating
  );

  return (
    <div className="h-screen">
      <div className="text-4xl text-theme-pink p-7 font-bold border-b">
        Your Reviews
      </div>
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col">
        {/* Buttons */}
        <div className="w-full max-w-6xl mb-6 flex justify-start space-x-4 ml-9">
          <Link
            to="/customer/reviews"
            className="py-2 px-5 bg-gray-300 text-gray-800 text-base font-semibold rounded hover:bg-gray-400 transition duration-200"
          >
            Add Review
          </Link>
          <Link
            to="/customer/reviews/past"
            className="py-2 px-5 bg-theme-pink text-white text-base font-semibold rounded hover:bg-pink-600 transition duration-200"
          >
            Past Reviews
          </Link>
        </div>

        {/* Sort Dropdown */}
        <div className="mb-4 mt-2">
          <label htmlFor="sort" className="mr-2 text-gray-700 font-medium ml-9">
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
        <div className="flex flex-col gap-4 px-9">
          {sortedReviews.map((review, index) => (
            <div
              key={index}
              className="p-6 bg-white border border-gray-300 rounded-lg shadow-md break-words overflow-hidden"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {review.Name}
              </h3>
              <p className="text-yellow-500 text-sm mt-1">
                {"★".repeat(review.Rating) + "☆".repeat(5 - review.Rating)}
              </p>
              <p className="mt-2 text-gray-700">{review.Comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PastReviews;
