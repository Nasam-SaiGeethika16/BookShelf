import React from 'react'
import { useNavigate } from 'react-router-dom';
import bannerImg from "../../assets/banner.png"

const Banner = () => {
  const navigate = useNavigate();
  return (
    <div className='flex flex-col md:flex-row-reverse py-8 sm:py-16 justify-between items-center gap-8 sm:gap-12 px-2 sm:px-4 md:px-8'>
      <div className='md:w-1/2 w-full flex items-center md:justify-end mb-6 md:mb-0'>
        <img src={bannerImg} alt='' className='w-full max-w-xs sm:max-w-md md:max-w-full h-auto object-contain' />
      </div>
      <div className='md:w-1/2 w-full'>
        <h1 className='text-2xl sm:text-4xl md:text-5xl font-medium mb-5 sm:mb-7'>Find the best reads</h1>
        <p className='mb-8 sm:mb-10 text-base sm:text-lg'>This week's new arrivals bring a fresh wave of unforgettable stories—from gripping thrillers that keep you on the edge of your seat, to powerful memoirs that stay with you long after the last page. Whether you're in the mood to escape, reflect, or be inspired, there's something here waiting just for you</p>
        <button 
          className="bg-green-800 hover:bg-green-900 text-white px-4 py-2 rounded transition duration-200 w-full sm:w-auto"
          onClick={() => navigate('/books')}
        >
          Start Reading
        </button>
      </div>
    </div>
  )
}

export default Banner