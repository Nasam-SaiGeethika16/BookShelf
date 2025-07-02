import React from 'react';
import { useFetchRecommendedBooksQuery } from '../../redux/features/books/booksApi';
import BookCard from '../books/BookCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Recommended = () => {
  const { data: books = [], isLoading, error } = useFetchRecommendedBooksQuery();

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
    <div className="py-8 sm:py-10 overflow-x-hidden w-full px-4 sm:px-8">
      <div className="flex items-center mb-4 sm:mb-6 w-full">
        <h2 className="text-2xl sm:text-3xl font-semibold px-1 sm:px-0">Recommended For You</h2>
      </div>
      <div className="relative w-full overflow-x-hidden">
        <button
          className="recommended-prev absolute left-0 top-1/2 -translate-y-1/2 bg-gray-700 text-white dark:bg-white dark:text-black rounded-full w-8 h-8 flex items-center justify-center text-xl shadow hover:bg-gray-900 dark:hover:bg-gray-200 transition z-20"
          aria-label="Previous"
        >
          {'<'}
        </button>
        <button
          className="recommended-next absolute right-0 top-1/2 -translate-y-1/2 bg-gray-700 text-white dark:bg-white dark:text-black rounded-full w-8 h-8 flex items-center justify-center text-xl shadow hover:bg-gray-900 dark:hover:bg-gray-200 transition z-20"
          aria-label="Next"
        >
          {'>'}
        </button>
        <Swiper
          slidesPerView={1}
          spaceBetween={3}
          navigation={{
            nextEl: '.recommended-next',
            prevEl: '.recommended-prev',
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 3,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 3,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 3,
            },
          }}
          modules={[Pagination, Navigation]}
          className="mySwiper w-full"
        >
          {books.map((book) => (
            <SwiperSlide key={book._id} className="w-full">
              <BookCard book={book} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Recommended;