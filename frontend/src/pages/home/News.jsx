import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { useFetchLatestNewsQuery } from '../../redux/features/books/booksApi';
import BookCard from '../books/BookCard';

const News = () => {
  const { data: news = [], isLoading, error } = useFetchLatestNewsQuery();

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
        <p className="text-red-500">Error loading news. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-10 overflow-x-hidden w-full px-4 sm:px-8">
      <div className="flex items-center mb-4 sm:mb-6 w-full">
        <h2 className="text-2xl sm:text-3xl font-semibold px-1 sm:px-0">New Releases</h2>
      </div>
      <div className="relative w-full overflow-x-hidden">
        <button
          className="news-prev absolute left-0 top-1/2 -translate-y-1/2 bg-gray-700 text-white dark:bg-white dark:text-black rounded-full w-8 h-8 flex items-center justify-center text-xl shadow hover:bg-gray-900 dark:hover:bg-gray-200 transition z-20"
          aria-label="Previous"
        >
          {'<'}
        </button>
        <button
          className="news-next absolute right-0 top-1/2 -translate-y-1/2 bg-gray-700 text-white dark:bg-white dark:text-black rounded-full w-8 h-8 flex items-center justify-center text-xl shadow hover:bg-gray-900 dark:hover:bg-gray-200 transition z-20"
          aria-label="Next"
        >
          {'>'}
        </button>
        <Swiper
          slidesPerView={1}
          spaceBetween={3}
          navigation={{
            nextEl: '.news-next',
            prevEl: '.news-prev',
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
          {news.map((item) => (
            <SwiperSlide key={item._id} className="w-full">
              <BookCard book={{
                _id: item._id,
                title: item.title,
                description: item.description,
                coverImage: item.coverImage,
                newPrice: item.newPrice || '',
                oldPrice: item.oldPrice || '',
              }} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default News;