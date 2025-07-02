import React, { useEffect } from 'react'
import Banner from './Banner'
import TopSellers from './TopSellers'
import Recommended from './Recommended'
import News from './News'
import About from './About'
import ContactUs from './ContactUs'
import { useLocation, useNavigate } from 'react-router-dom'

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.hash) {
      navigate('/', { replace: true });
    }
  }, [location, navigate]);

  return (
    <>
        <Banner/>
        <TopSellers/>
        <Recommended/>
        <News/>
        <div className="mt-16" id="about-section">
          <About />
        </div>
        <div className="mt-16" id="contact-us-section">
          <ContactUs />
        </div>
    </>
  )
}

export default Home