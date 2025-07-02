import React from 'react';
import AboutUsImg from '../../assets/AboutUs.png';

const About = () => (
  <section className="w-full py-8 px-2 sm:px-4 md:px-8 bg-white rounded-xl">
    <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-center">About Us</h2>
    <div className="mb-6">
      <p className="italic text-sm text-gray-600 dark:text-gray-300 mt-0 mb-6 text-center">
        Discover our story in bringing the world of books closer to every reader.
      </p>
    </div>
    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 w-full max-w-7xl mx-auto">
      <div className="flex-1 w-full text-left">
        <div className="mb-8">
          <h3 className="text-xl sm:text-2xl font-semibold mb-2">Our Story</h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-justify">
            Our bookstore began with a love for literature and a commitment to making great books accessible to everyone—whether you're searching for timeless classics, modern fiction, academic references, or children's favorites. Trust, quality, and a deep understanding of what readers seek have been the pillars of our journey.
          </p>
        </div>
        <div className="mb-8">
          <h3 className="text-xl sm:text-2xl font-semibold mb-2">Our Mission</h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-justify">
            At BookShelf, our mission is to cultivate a love for reading by offering a diverse and thoughtfully curated collection of books. We aim to be a trusted companion for readers of all ages and interests, providing resources that inform, inspire, and entertain.
          </p>
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold mb-2">Our Vision</h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-justify">
            We envision becoming a literary hub where every reader finds their next favorite book. With an ever-growing selection and a passion for storytelling, we aspire to ignite curiosity and foster lifelong learning through the written word.
          </p>
        </div>
      </div>
      <div className="flex-1 w-full flex justify-center md:justify-end">
        <img src={AboutUsImg} alt="About Us" className="max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl w-full h-auto rounded-xl object-cover md:mt-32" />
      </div>
    </div>
  </section>
);

export default About; 