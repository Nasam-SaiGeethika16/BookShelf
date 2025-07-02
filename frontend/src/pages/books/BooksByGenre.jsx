import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchBooksByGenreQuery } from '../../redux/features/books/booksApi';
import BookCard from './BookCard';

const formatGenre = (genre) =>
  genre.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

const BooksByGenre = () => {
  const { genre } = useParams();
  const { data: books = [], isLoading, error } = useFetchBooksByGenreQuery(genre);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading books. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="w-full px-8 py-2 dark:bg-gray-900 bg-white min-h-screen">
      <h2 className="text-3xl font-semibold my-8">
        {formatGenre(genre)}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {books.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default BooksByGenre; 