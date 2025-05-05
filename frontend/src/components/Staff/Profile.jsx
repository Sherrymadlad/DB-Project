import React, { useState } from 'react';

const Profile = () => {
  const dummyData = {
    profilePic: '../../assets/Logo.png',
    name: 'Ali Khan',
    username: 'alikhan123',
    password: '',
    phone: '+92 300 1234567',
    email: 'ali@example.com'
  };

  const [user, setUser] = useState(dummyData);
  const [formData, setFormData] = useState(dummyData);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    old: false,
    new: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, profilePic: imageUrl }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const updatedPayload = {
        ...formData,
        oldPassword: oldPassword || undefined,
        newPassword: newPassword || undefined,
      };

      await axios.put('/api/user/update-profile', updatedPayload); // Replace with actual endpoint

      // Assume backend updates the password if newPassword is valid
      if (newPassword) {
        formData.password = newPassword;
      }

      setUser(formData);
      setEditMode(false);
      setOldPassword('');
      setNewPassword('');
      alert('Profile updated!');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;
    try {
      await axios.delete('/api/user/delete-account'); // Replace with actual endpoint
      alert('Account deleted.');
    } catch (err) {
      console.error(err);
      alert('Failed to delete account.');
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="text-4xl text-theme-pink p-7 font-bold border-b">
        Profile Information
      </div>
      <div className="w-full h-full mx-auto p-8 bg-white text-theme-brown space-y-10 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex justify-center items-center flex-col gap-4">
            <img
              src={formData.profilePic}
              alt="Profile"
              className="w-56 h-56 rounded-full object-cover border border-theme-pink"
            />
            {editMode && (
              <label className="cursor-pointer bg-theme-pink text-white px-4 py-2 rounded hover:bg-pink-700 transition">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {['name', 'username', 'phone', 'email'].map((field) => (
              <div key={field}>
                <label className="text-2xl text-theme-pink capitalize">{field}</label>
                {editMode ? (
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                ) : (
                  <p className="text-lg mt-1">{user[field]}</p>
                )}
              </div>
            ))}

            <div>
              <label className="text-2xl text-theme-pink capitalize">{editMode? "Old Password":"Password "}</label>
              {editMode ? (
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm"
                  >
                    {showPasswords.current ? 'Hide' : 'Show'}
                  </button>
                </div>
              ) : (
                <p className="text-lg mt-1">••••••••</p>
              )}
            </div>

            {editMode && (
                <div>
                  <label className="text-2xl text-theme-pink">New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm"
                    >
                      {showPasswords.new ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {editMode ? (
            <div className="flex gap-4">
              <button
                onClick={handleUpdate}
                className="bg-theme-pink text-white px-5 py-2 rounded hover:bg-pink-700 transition"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setFormData(user);
                  setOldPassword('');
                  setNewPassword('');
                }}
                className="text-theme-brown underline"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-theme-pink text-white px-5 py-2 rounded hover:bg-pink-700 transition"
            >
              Edit Profile
            </button>
          )}
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
