import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi2';

const NoResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <HiOutlineExclamationCircle className="w-16 h-16 text-gray-400 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
        No Books Found
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">
        We couldn't find any books matching "{query}"
      </p>
      <Link
        to="/books"
        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
      >
        Browse All Books
      </Link>
    </div>
  );
};

export default NoResultsPage;