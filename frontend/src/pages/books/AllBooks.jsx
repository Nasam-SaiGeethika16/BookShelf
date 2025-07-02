import React, { useState } from 'react';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';
import BookCard from './BookCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const AllBooks = () => {
  const { data: books = [], isLoading, error } = useFetchAllBooksQuery();
  const [showAllBooks, setShowAllBooks] = useState(false);

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
    <div className="py-6 sm:py-10 w-full overflow-x-hidden">
      <div className="flex items-center mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold">All Books</h2>
      </div>

      {!showAllBooks ? (
        <>
          <div className="relative mb-6 sm:mb-8 w-full">
            <button
              className="allbooks-prev absolute left-0 top-1/2 -translate-y-1/2 bg-gray-700 text-white dark:bg-white dark:text-black rounded-full w-8 h-8 flex items-center justify-center text-xl shadow hover:bg-gray-900 dark:hover:bg-gray-200 transition z-20"
              aria-label="Previous"
            >
              {'<'}
            </button>
            <button
              className="allbooks-next absolute right-0 top-1/2 -translate-y-1/2 bg-gray-700 text-white dark:bg-white dark:text-black rounded-full w-8 h-8 flex items-center justify-center text-xl shadow hover:bg-gray-900 dark:hover:bg-gray-200 transition z-20"
              aria-label="Next"
            >
              {'>'}
            </button>
            <Swiper
              slidesPerView={1}
              spaceBetween={8}
              navigation={{
                nextEl: '.allbooks-next',
                prevEl: '.allbooks-prev',
              }}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                  spaceBetween: 8,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 12,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 16,
                },
              }}
              modules={[Pagination, Navigation]}
              className="mySwiper w-full"
            >
              {books.slice(0, 3).map((book) => (
                <SwiperSlide key={book._id} className="w-full">
                  <BookCard book={book} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => setShowAllBooks(true)}
              className="bg-green-800 hover:bg-green-900 text-white px-6 py-2 rounded flex items-center gap-2 transition duration-200 dark:bg-green-700 dark:hover:bg-green-900 w-full sm:w-auto"
            >
              View More
            </button>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-6xl mx-auto">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBooks;