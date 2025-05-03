import React, { useState } from 'react';
import background from '../assets/signup-bg.jpg';
import { UserCircleIcon } from '@heroicons/react/24/solid';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer',
    profilePic: null,
  });
  const [preview, setPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic') {
      const file = files[0];
      setFormData({ ...formData, profilePic: file });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="text-4xl text-theme-pink p-6 font-bold border-b-2">
        Signup
      </div>
      <div className='h-full w-full text-theme-brown text-shadow-2xs' style={{ backgroundImage: `url(${background})` }}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 px-8 w-full justify-center items-center" >
            <div className='flex flex-row w-full gap-4 px-2'>
                <div className="flex flex-col gap-4 p-6 w-1/2" >
                    <div className="flex flex-col">
                        <label htmlFor="name" className="text-sm font-semibold">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="border p-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-theme-pink"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="username" className="text-sm font-semibold">Username</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="border p-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-theme-pink"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-sm font-semibold">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border p-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-theme-pink"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password" className="text-sm font-semibold">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="border p-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-theme-pink"
                            required
                        />
                        <label className="text-xs mt-1 flex gap-2 items-center">
                            <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)}
                            className="accent-theme-pink"
                            />
                            Show Password
                        </label>
                        </div>
                    <div className="flex flex-col">
                        <label htmlFor="phone" className="text-sm font-semibold">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="border p-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-theme-pink"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="role" className="text-sm font-semibold">Role</label>
                        <select
                            name="role"
                            id="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="border p-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-theme-pink"
                            required
                        >
                            <option value="customer">Customer</option>
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center gap-2 w-1/2">
                    <label className="relative w-80 h-80 rounded-full overflow-hidden border-3 border-theme-pink shadow-md cursor-pointer group">
                        {preview ? (
                            <img
                                src={preview}
                                alt="Profile Preview"
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 group-hover:text-theme-pink">
                                <UserCircleIcon className="h-24 w-24" />
                            </div>
                        )}
                        <input
                            type="file"
                            name="profilePic"
                            accept="image/*"
                            onChange={handleChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </label>
                    <span className="text-lg font-semibold text-shadow-2xs">Upload Profile Picture</span>
                </div>
            </div>
            <button
                type="submit"
                className="bg-theme-pink text-white py-2 rounded hover:bg-pink-600 w-60"
            >
                Sign Up
            </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
