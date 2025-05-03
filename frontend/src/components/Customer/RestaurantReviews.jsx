import React, { useState } from "react";
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

  const handleStarClick = (index) => {
    setSelectedStars(index + 1);
  };

  const handleSubmit = () => {
    if (reviewText && selectedStars > 0) {
      setReviews([{ name: "You", stars: selectedStars, comment: reviewText }, ...reviews]);
      setReviewText("");
      setSelectedStars(0);
    }
  };

  const sortedReviews = [...reviews].sort((a, b) =>
    sortOrder === "asc" ? a.stars - b.stars : b.stars - a.stars
  );

  return (
    <div className="p-6 max-w-3xl mx-auto mt-20"> {/* mt-20 to push content down */}
      {/* Navigation Buttons */}
      <div className="fixed top-6 left-70 flex gap-4 z-10">
        <button className="bg-white border px-4 py-2 rounded hover:bg-gray-100">Details</button>
        <button className="bg-white border px-4 py-2 rounded hover:bg-gray-100">Reserve</button>
        <button className="bg-theme-pink text-white px-4 py-2 rounded hover:bg-pink-600">Reviews</button>
      </div>

      <h1 className="text-3xl font-bold text-center text-theme-pink mb-6">
        The Spice Route
      </h1>

      <div className="text-center mb-6">
        <StarRating rating={averageRating} />
        <p className="text-gray-500 text-sm mt-1">Rated {averageRating} out of 5</p>
      </div>

      {/* Leave a Review Section */}
      <div className="bg-white p-4 rounded shadow relative mb-10">
        <div className="flex justify-center mb-4">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`h-5 w-5 cursor-pointer mx-1 ${
                i < selectedStars ? "text-yellow-500" : "text-gray-300"
              }`}
              onClick={() => handleStarClick(i)}
            />
          ))}
        </div>
        <textarea
          className="w-full border rounded p-2 text-sm resize-none max-h-32 overflow-auto"
          rows="3"
          placeholder="Leave a review!"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
        <div className="flex justify-center mt-4">
          <button
            className="bg-theme-pink text-white px-4 py-2 rounded hover:bg-pink-600"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
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