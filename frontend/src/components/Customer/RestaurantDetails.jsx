import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import defaultRestaurantImage from "../../assets/default-restaurant.png";

const RestaurantDetails = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [rating, setRating] = useState(0);
  const [liked, setLiked] = useState(false);
  const [images, setImages] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const restaurantId = localStorage.getItem('restaurantId');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!restaurantId) return;

    const fetchData = async () => {
      try {
        const [
          restaurantRes,
          ratingRes,
          likedRes,
          imageRes,
          cuisinesRes
        ] = await Promise.all([
          axios.get(`http://localhost:5000/api/restaurants/${restaurantId}`),
          axios.get(`http://localhost:5000/api/stats/${restaurantId}`),
          axios.get(`http://localhost:5000/api/users/${userId}/restaurant-preferences`),
          axios.get(`http://localhost:5000/api/restaurants/${restaurantId}/images`),
          axios.get(`http://localhost:5000/api/restaurants/${restaurantId}/cuisines`)
        ]);
        setRestaurant(restaurantRes.data.data);
        setRating(ratingRes.data.data.averageRating);
        setLiked(
          likedRes.data.some(pref => pref.RestaurantID == restaurantId)
        );
        setImages(imageRes.data.data);
        setCuisines(cuisinesRes.data.data);
      } catch (err) {
        console.error("Failed to fetch restaurant data:", err);
      }
    };

    fetchData();
  }, []);

  const handleLike = async () => {
    try {
      if (liked) {
        await axios.delete(`http://localhost:5000/api/users/${userId}/restaurant-preferences`, {
          data: { restaurantId },
        });        
      } else {
        await axios.post(`http://localhost:5000/api/users-restaurant-preferences`, { userId, restaurantId });
      }
      setLiked(!liked);
    } catch (err) {
      console.error("Failed to update preference:", err);
    }
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

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (!restaurant) return <div className="p-6 text-gray-600">Loading...</div>;

  const isDefaultImage = !restaurant.profilePic;

  return (
    <div className="min-h-screen w-full bg-gray-50 text-theme-brown relative">
      <div className="flex gap-4 p-6">
        <Link className="bg-theme-pink text-white px-4 py-2 rounded shadow-md" to="/customer/restaurants/details">Details</Link>
        <Link className="bg-white border px-4 py-2 rounded hover:bg-gray-100" to="/customer/restaurants/reserve">Reserve</Link>
        <Link className="bg-white border px-4 py-2 rounded hover:bg-gray-100" to="/customer/restaurants/reviews">Reviews</Link>
      </div>

      <div className="flex flex-col md:flex-row gap-10 items-center px-6 pb-10 mt-16 relative">
        <div className="w-60 aspect-square rounded-full overflow-hidden border-4 border-theme-pink shadow-md flex items-center justify-center">
          <img
            src={restaurant.profilePic ? `data:image/jpeg;base64,${restaurant.profilePic}` : defaultRestaurantImage}
            alt="Restaurant"
            className={`object-cover transition-all duration-300 ${isDefaultImage ? 'w-[90%] h-[90%]' : 'w-full h-full'}`}
          />
        </div>

        <div className="flex justify-between items-start w-full">
          <div className="flex flex-col gap-2 w-full max-w-2xl relative">
            <h1 className="text-3xl font-bold text-theme-pink">{restaurant.Name}</h1>
            <p className="text-sm text-gray-700 italic">{restaurant.Description}</p>
            <p><strong>Location:</strong> {restaurant.Location}</p>
            <p><strong>Cuisines:</strong> {cuisines.map(c => c.CuisineName).join(', ')}</p>
            <p>
              <strong>Operating Hours:</strong>{' '}
              {formatTime(restaurant.OperatingHoursStart)} - {formatTime(restaurant.OperatingHoursEnd)}
            </p>
            <p><strong>Phone:</strong> {restaurant.PhoneNum}</p>
          </div>

          <div className="flex flex-col items-end gap-2 mr-20">
            <button onClick={handleLike} className="mt-2">
              {liked ? (
                <HeartSolid className="h-8 w-8 text-red-500" />
              ) : (
                <HeartOutline className="h-8 w-8 text-gray-400 hover:text-red-400" />
              )}
            </button>
            <div className="text-theme-pink font-semibold text-4xl mt-4">{rating.toFixed(1)}</div>
            <div className="flex gap-1">{getStarRating(rating)}</div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-16 mt-16">
        <h2 className="text-2xl font-semibold text-theme-pink mb-4">Restaurant Images</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.length > 0 ? (
            images.map((img, i) => (
              <img
                key={i}
                src={`data:image/jpeg;base64,${img}`}
                alt={`Restaurant view ${i}`}
                className="w-full h-48 object-cover rounded-lg shadow-sm"
              />
            ))
          ) : (
            <p className="text-gray-500 col-span-full">No images available.</p>
          )}
        </div>
      </div>

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
