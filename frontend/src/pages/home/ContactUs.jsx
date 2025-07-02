import React, { useState } from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '', honey: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    // Spam protection: honeypot field should be empty
    if (form.honey) {
      setError('Spam detected.');
      return;
    }
    if (!form.name || !form.email || !form.message) {
      setError('All fields are required.');
      return;
    }
    if (!validateEmail(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, message: form.message })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Thank you for contacting us!');
        setForm({ name: '', email: '', message: '', honey: '' });
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to submit. Please try again.');
      }
    } catch (err) {
      setError('Failed to submit. Please try again.');
    }
  };

  return (
    <section className="w-full py-8 px-2 sm:px-4 md:px-8">
      <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>Contact Us</h2>
      <p className="text-base sm:text-lg mb-8 text-center">Reach out to us for any inquiries or feedback.</p>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 md:gap-12 items-stretch flex-wrap w-full overflow-x-auto">
        {/* Left: Contact Details */}
        <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6 text-base sm:text-lg mb-8 md:mb-0">
          <div className="flex items-center gap-4">
            <FaMapMarkerAlt className="text-xl sm:text-2xl text-gray-600" />
            <span>123 Book Street<br/>Reading City, RC 12345</span>
          </div>
          <div className="flex items-center gap-4">
            <FaPhoneAlt className="text-xl sm:text-2xl text-gray-600" />
            <span>Phone: +91 9876543210</span>
          </div>
          <div className="flex items-center gap-4">
            <FaEnvelope className="text-xl sm:text-2xl text-gray-600" />
            <span>Email: info@bookshelf.com</span>
          </div>
        </div>
        {/* Right: Contact Form */}
        <form onSubmit={handleSubmit} className="w-full md:w-1/2 flex-1 space-y-4 sm:space-y-6 bg-white p-3 sm:p-8 rounded shadow-md min-w-0">
          {/* Honeypot field for spam protection */}
          <input
            type="text"
            name="honey"
            value={form.honey}
            onChange={handleChange}
            style={{ display: 'none' }}
            tabIndex="-1"
            autoComplete="off"
          />
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name*"
            required
            className="w-full border border-gray-300 rounded px-4 py-2 sm:py-3 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email*"
            required
            className="w-full border border-gray-300 rounded px-4 py-2 sm:py-3 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Message*"
            required
            rows={4}
            className="w-full border border-gray-300 rounded px-4 py-2 sm:py-3 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white text-base sm:text-lg font-semibold py-2 sm:py-3 rounded transition-colors"
          >
            Send Message
          </button>
          {error && <div className="text-red-600 text-center mt-2">{error}</div>}
          {success && <div className="text-green-700 text-center mt-2">{success}</div>}
        </form>
      </div>
    </section>
  );
};

export default ContactUs; 