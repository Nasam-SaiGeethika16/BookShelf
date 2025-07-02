import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';

import Loading from '../../components/Loading';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { HiHome, HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";
import { HiMenu, HiViewGrid } from "react-icons/hi";
import { HiOutlineViewGrid } from "react-icons/hi";
import { MdOutlineManageHistory } from "react-icons/md";
import { useTheme } from '../../context/ThemeContext';
import { FaRegMoon } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import avatarImg from '../../assets/avatar.png';
import { AuthProvide } from '../../context/AuthContext';

const DashboardLayout = () => {
  
  const navigate = useNavigate()
  const { isDarkMode, toggleTheme } = useTheme();
  const [booksMenuOpen, setBooksMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/")
  }

  // Custom SVG for theme toggle avatar
  const ThemeToggleAvatar = () => (
    <button
      onClick={toggleTheme}
      className={`p-1 rounded-full border-2 ${isDarkMode ? 'border-blue-500' : 'border-transparent'} bg-white dark:bg-gray-800 mr-2`}
      aria-label="Toggle theme"
    >
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="15" fill="#FFB300" stroke="#4285F4" strokeWidth="2" />
        <circle cx="16" cy="16" r="7" fill="#4285F4" fillOpacity="0.7" />
        <circle cx="16" cy="12" r="4" fill="#FFD600" />
      </svg>
    </button>
  );

  return (
    <section className="flex bg-gray-50 dark:bg-gray-900 min-h-screen overflow-hidden">
      {/* Overlay for mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={() => setSidebarOpen(false)}></div>
      )}
      {/* Sidebar Drawer */}
      {sidebarOpen && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={() => setSidebarOpen(false)}></div>
          {/* Sidebar */}
          <aside className="fixed z-50 top-0 left-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64 flex flex-col transition-transform duration-200 ease-in-out">
            <button
              className="p-2 m-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors self-start"
              aria-label="Close sidebar"
              onClick={() => setSidebarOpen(false)}
            >
              <HiViewGrid className="size-6 text-green-800 dark:text-green-400" />
            </button>
            <div className="flex flex-col h-full">
              <nav className="flex flex-col mt-20 mx-4 space-y-2">
                <Link to="/dashboard" className="inline-flex items-center py-3 px-2 text-green-800 dark:text-green-400 bg-green-100 dark:bg-gray-900 rounded-lg" onClick={() => setSidebarOpen(false)}>
                  Dashboard
                </Link>
                {/* Books Management Dropdown */}
                <button
                  onClick={() => setBooksMenuOpen((open) => !open)}
                  className="inline-flex items-center py-3 px-2 hover:text-green-800 dark:hover:text-green-400 hover:bg-green-100 dark:hover:bg-gray-900 focus:text-green-800 dark:focus:text-green-400 focus:bg-green-100 dark:focus:bg-gray-900 rounded-lg w-full"
                >
                  Books Management
                  <svg className={`ml-auto h-4 w-4 transition-transform ${booksMenuOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
                {booksMenuOpen && (
                  <div className="ml-8 flex flex-col gap-1">
                    <Link to="/dashboard/manage-books" className="inline-flex items-center py-2 px-2 hover:text-green-800 dark:hover:text-green-400 hover:bg-green-100 dark:hover:bg-gray-900 focus:text-green-800 dark:focus:text-green-400 focus:bg-green-100 dark:focus:bg-gray-900 rounded-lg" onClick={() => setSidebarOpen(false)}>
                      Manage Books
                    </Link>
                    <Link to="/dashboard/add-new-book" className="inline-flex items-center py-2 px-2 hover:text-green-800 dark:hover:text-green-400 hover:bg-green-100 dark:hover:bg-gray-900 focus:text-green-800 dark:focus:text-green-400 focus:bg-green-100 dark:focus:bg-gray-900 rounded-lg" onClick={() => setSidebarOpen(false)}>
                      Add Book
                    </Link>
                  </div>
                )}
                <button
                  onClick={() => { handleLogout(); setSidebarOpen(false); }}
                  className="mt-2 px-5 py-2 bg-green-800 dark:bg-green-700 text-white rounded hover:bg-green-900 dark:hover:bg-green-900 focus:bg-green-900 dark:focus:bg-green-900 transition"
                >
                  Logout
                </button>
              </nav>
            </div>
          </aside>
        </>
      )}
      <div className="flex-grow text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-900">
        <header className="flex items-center h-20 px-6 sm:px-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 w-full">
          {/* Admin Dashboard Icon - far left, now opens sidebar */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-4"
            aria-label="Open sidebar"
            onClick={() => setSidebarOpen(true)}
          >
            <HiViewGrid className="size-6 text-green-800 dark:text-green-400" />
          </button>
          <div className="flex flex-1 justify-end items-center gap-3">
            {/* Home Navigation Button (user site) */}
            <Link 
              to="/"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Go to home page"
            >
              <HiHome className="size-6" />
            </Link>
            {/* Removed theme toggle and avatar dropdown */}
          </div>
        </header>
        <main className="p-6 sm:p-10 space-y-2 bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col items-center md:flex-row md:justify-center">
            <div className="w-full text-center">
              {location.pathname.includes('/dashboard/manage-books') ? (
                <h1 className="text-4xl font-semibold mb-2 text-green-800 dark:text-green-400">Manage Books</h1>
              ) : location.pathname.includes('/dashboard/add-new-book') ? (
                <h1 className="text-4xl font-semibold mb-2 text-green-800 dark:text-green-400">Add Book</h1>
              ) : (
                <h1 className="text-4xl font-semibold mb-2 text-green-800 dark:text-green-400">Dashboard</h1>
              )}
            </div>
          </div>
          <Outlet/>
        </main>
      </div>
    </section>
  )
}

export default DashboardLayout