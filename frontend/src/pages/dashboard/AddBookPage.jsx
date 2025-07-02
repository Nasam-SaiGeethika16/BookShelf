import React, { useState } from 'react';
import { useAddBookMutation } from '../../api/booksApi';
import { useNavigate } from 'react-router-dom';

const AddBookPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    publishedDate: ''
  });

  const navigate = useNavigate();
  const [addBook] = useAddBookMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookData = {
        title: formData.title,
        author: formData.author,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        imageUrl: formData.imageUrl,
        publishedDate: formData.publishedDate
      };
      await addBook(bookData).unwrap();
      navigate('/dashboard/books');
    } catch (error) {
      console.error('Failed to add book:', error);
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
      <input
        type="text"
        id="imageUrl"
        name="imageUrl"
        value={formData.imageUrl}
        onChange={handleChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder="Paste image URL here"
      />
    </div>
  );
};

export default AddBookPage; 