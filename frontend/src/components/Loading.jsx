import React from 'react';

const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      <p className="mt-6 italic text-gray-600 text-center" style={{ fontFamily: 'Inter, Roboto, sans-serif' }}>
        Your one-stop destination for discovering and exploring the world of books. Find your next favorite read with us.
      </p>
    </div>
  );
};

export default Loading;