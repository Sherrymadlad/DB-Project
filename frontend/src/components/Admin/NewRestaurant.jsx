import React, { useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const CUISINES = [
  'Pakistani',
  'Chinese',
  'Italian',
  'Mexican',
  'Fast Food',
  'BBQ',
  'Continental',
  'Indian',
  'Japanese',
  'Thai',
];

const LocationMarker = ({ position, onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const NewRestaurant = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: '',
    startTime: '',
    endTime: '',
  });

  const [location, setLocation] = useState({ lat: 31.5497, lng: 74.3436 }); // Lahore default
  const [address, setAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [restaurantImages, setRestaurantImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [tables, setTables] = useState([]);
  const [newTable, setNewTable] = useState({ capacity: '', description: '' });

  const mapRef = useRef(null);
  const imageInputRef = useRef(null);

  const updateAddress = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      setAddress(data.display_name || '');
    } catch (err) {
      console.error('Error fetching address:', err);
    }
  };

  const handleSearch = async () => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
      );
      const data = await res.json();
      if (data?.[0]) {
        const { lat, lon, display_name } = data[0];
        const newLoc = { lat: parseFloat(lat), lng: parseFloat(lon) };
        setLocation(newLoc);
        setAddress(display_name);
        mapRef.current?.setView(newLoc, 15);
      }
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const handleMapClick = useCallback((latlng) => {
    setLocation(latlng);
    updateAddress(latlng.lat, latlng.lng);
  }, []);

  const handleInput = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCuisineChange = (e) => {
    const value = e.target.value;
    setSelectedCuisines((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  };

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.type.startsWith('image/'));

    const newImagePreviews = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    setRestaurantImages((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...newImagePreviews]);

    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const removeImage = (index) => {
    const newFiles = [...restaurantImages];
    const newPreviews = [...imagePreviews];

    URL.revokeObjectURL(newPreviews[index].url);
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setRestaurantImages(newFiles);
    setImagePreviews(newPreviews);
  };

  const addTable = () => {
    const cap = parseInt(newTable.capacity);
    if (!cap || cap <= 0) return alert('Capacity must be a positive number.');
    setTables((prev) => [...prev, { ...newTable, capacity: cap }]);
    setNewTable({ capacity: '', description: '' });
  };

  const removeTable = (index) => {
    setTables((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));
    data.append('latitude', location.lat);
    data.append('longitude', location.lng);
    data.append('address', address);
    if (profilePic) data.append('profilePic', profilePic);
    restaurantImages.forEach((img, idx) => data.append(`images[${idx}]`, img));
    selectedCuisines.forEach((cuisine, idx) => data.append(`cuisines[${idx}]`, cuisine));
    tables.forEach((table, idx) => {
      data.append(`tables[${idx}][capacity]`, table.capacity);
      data.append(`tables[${idx}][description]`, table.description);
    });

    console.log('Form submitted');
    // Submit logic here (e.g., axios.post or fetch)
  };

  return (
    <div className='h-screen'>
      <div className="text-4xl text-theme-pink p-7 font-bold border-b">
        Add a Restaurant
      </div>
      <div className="p-6 max-w-7xl mx-auto bg-white text-theme-brown">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Basic Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="font-medium">Restaurant Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleInput}
                className="mt-2 w-full border rounded-md p-3 shadow" />
            </div>
            <div>
              <label className="font-medium">Phone Number</label>
              <input type="tel" name="phone" required value={formData.phone} onChange={handleInput}
                className="mt-2 w-full border rounded-md p-3 shadow" />
            </div>
            <div>
              <label className="font-medium">Opening Time</label>
              <input type="time" name="startTime" required value={formData.startTime} onChange={handleInput}
                className="mt-2 w-full border rounded-md p-3 shadow" />
            </div>
            <div>
              <label className="font-medium">Closing Time</label>
              <input type="time" name="endTime" required value={formData.endTime} onChange={handleInput}
                className="mt-2 w-full border rounded-md p-3 shadow" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-medium">Description</label>
            <textarea name="description" rows="4" value={formData.description} onChange={handleInput}
              className="mt-2 w-full border rounded-md p-3 shadow resize-none" />
          </div>

          {/* Cuisine Selection */}
          <div>
            <label className="font-medium block mb-2">Cuisines Offered</label>
            <div className="flex flex-wrap gap-3">
              {CUISINES.map((cuisine) => {
                const isSelected = selectedCuisines.includes(cuisine);
                return (
                  <label
                    key={cuisine}
                    className={`flex items-center gap-2 cursor-pointer ${
                      isSelected ? 'text-pink-500' : 'text-gray-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={cuisine}
                      checked={isSelected}
                      onChange={handleCuisineChange}
                      className="accent-pink-500"
                    />
                    {cuisine}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Table Section */}
          <div>
            <label className="font-medium block mb-2">Add Tables</label>
            <div className="flex gap-4 mb-2">
              <input
                type="number"
                placeholder="Capacity"
                value={newTable.capacity}
                onChange={(e) => setNewTable((p) => ({ ...p, capacity: e.target.value }))}
                className="border rounded-md p-2 w-28"
              />
              <input
                type="text"
                placeholder="Description"
                value={newTable.description}
                onChange={(e) => setNewTable((p) => ({ ...p, description: e.target.value }))}
                className="border rounded-md p-2 flex-1"
              />
              <button type="button" onClick={addTable}
                className="bg-theme-pink hover:bg-pink-600 text-white px-4 rounded-md shadow">
                Add
              </button>
            </div>

            {tables.length > 0 && (
              <ul className="space-y-2">
                {tables.map((table, idx) => (
                  <li key={idx} className="flex justify-between items-center bg-gray-100 p-3 rounded shadow">
                    <span>Capacity: {table.capacity} | {table.description}</span>
                    <button type="button" onClick={() => removeTable(idx)} className="text-red-600">✕</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Map + Search */}
          <div>
            <label className="font-medium">Find Restaurant Location</label>
            <div className="flex gap-3 my-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search area e.g. Gulberg"
                className="w-full border rounded-md p-2 shadow"
              />
              <button type="button" onClick={handleSearch} className="bg-theme-pink text-white px-4 py-2 rounded-md shadow hover:bg-pink-600">
                Search
              </button>
            </div>

            <div className="h-64 rounded-md overflow-hidden border shadow">
              <MapContainer
                center={[location.lat, location.lng]}
                zoom={13}
                scrollWheelZoom
                className="h-full w-full"
                whenCreated={(mapInstance) => {
                  mapRef.current = mapInstance;
                }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <LocationMarker position={location} onMapClick={handleMapClick} />
              </MapContainer>
            </div>

            {address && <p className="mt-2 text-sm text-gray-600"><strong>Selected Address:</strong> {address}</p>}
            </div>

            {/* Profile Pic */}
            <div>
            <label className="font-medium block mb-2">Profile Picture</label>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border">
                {profilePreview ? (
                  <img src={profilePreview} alt="profile preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
              </div>
              <label className="cursor-pointer bg-theme-pink hover:bg-pink-600 text-white px-4 py-2 rounded-md shadow">
                Choose Profile
                <input type="file" accept="image/*" onChange={handleProfileChange} className="hidden" />
              </label>
            </div>
            </div>

            {/* Gallery Uploads */}
            <div>
            <label className="font-medium block mb-3">Restaurant Gallery</label>
            <label className="cursor-pointer inline-block bg-theme-pink hover:bg-pink-600 text-white px-4 py-2 rounded-md shadow mb-4">
              Add Images
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
                ref={imageInputRef}
                className="hidden"
              />
            </label>
            <div className="flex flex-wrap gap-4">
              {imagePreviews.map((imgObj, idx) => (
                <div key={idx} className="relative w-24 h-24 border rounded-md overflow-hidden shadow">
                  <img src={imgObj.url} alt={`img-${idx}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(idx)}
                    className="absolute top-0 right-0 bg-black bg-opacity-50 text-white rounded-bl px-1 text-xs">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-theme-pink hover:bg-pink-600 text-white py-3 px-6 rounded-md shadow"
          >
            Register Restaurant
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewRestaurant;
