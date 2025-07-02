import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { currentUser } = useAuth();
  const [form, setForm] = useState({
    name: currentUser?.displayName || '',
    address: '',
    password: '',
  });
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('Profile updated successfully!');
    // Here you would update the user profile in Firebase or your backend
  };

  return (
    <div className="max-w-lg bg-white dark:bg-gray-800 shadow-md rounded p-8 mt-10 ml-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">My Profile</h2>
      {success && <div className="bg-green-100 text-green-800 p-3 rounded mb-4">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-semibold text-gray-900 dark:text-white" htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white bg-white dark:bg-gray-700"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-900 dark:text-white" htmlFor="address">Delivery Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white bg-white dark:bg-gray-700"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-900 dark:text-white" htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white bg-white dark:bg-gray-700"
          />
        </div>
        <button type="submit" className="bg-green-800 hover:bg-green-900 text-white px-6 py-2 rounded font-semibold transition duration-200">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile; 