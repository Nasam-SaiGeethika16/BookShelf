import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { useEffect, useState } from 'react'
import Loading from './components/Loading';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

function App() {
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();

  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Cleanup timer
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
      <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
        <Toaster position="top-center" reverseOrder={false} />
        <Navbar />
        <main className='flex-grow max-w-screen-2xl mx-auto px-4 py-6 font-primary dark:bg-gray-900 dark:text-white pt-20'>
          <Outlet />
        </main>
        <Footer />
      </div>
  )
}

export default App
