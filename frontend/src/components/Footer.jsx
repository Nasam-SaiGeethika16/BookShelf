import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useSubscribeMutation } from '../redux/features/subscriptions/subscriptionsApi';
import { toast } from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribe, { isLoading, isSuccess, isError, error }] = useSubscribeMutation();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      const result = await subscribe(email).unwrap();
      toast.success(result.message);
      setEmail('');
    } catch (err) {
      toast.error(err.data.message || 'Subscription failed');
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="border-t border-gray-800 w-full flex items-center justify-center min-h-[70px]">
        <p className="text-center text-gray-400 text-sm sm:text-xs">&copy; 2025 BookShelf. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer