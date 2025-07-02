import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  HiOutlineHeart,
  HiOutlineShoppingCart,
  HiOutlineHome,
  HiOutlineUser,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineBookOpen,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";
import { HiMenu, HiX } from "react-icons/hi";
import { IoSearchOutline, IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { useTheme } from '../context/ThemeContext';
import React, { useState, useRef, useEffect } from 'react';
import { useLazySearchBooksQuery } from '../redux/features/books/booksApi';
import { animateScroll as scroll, scroller } from 'react-scroll';
import { HiArrowNarrowRight } from 'react-icons/hi';
import userAvatar from '../assets/avatar.png';
import Switch from 'react-switch';
import toast from 'react-hot-toast';

const navigation = [
  { name: 'Orders', href: '/orders' },
  { name: 'Cart Page', href: '/cart' },
  { name: 'Check Out', href: '/checkout' },
];

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const { isDarkMode, toggleTheme, setLightMode } = useTheme();

  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [triggerSearch, { data: searchedBooks, isFetching }] = useLazySearchBooksQuery();
  const inputRef = React.useRef();
  const avatarRef = useRef();
  const dropdownRef = useRef();

  const handleLogOut = () => {
    logout();
    setLightMode();
    toast.success('Logged out successfully!');
    navigate('/');
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target) &&
        !event.target.closest('[aria-label="Wishlist"]') &&
        !event.target.closest('[aria-label="Cart"]')
      ) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Add this function to handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim()) {
      setShowDropdown(true);
      triggerSearch(value);
    } else {
      setShowDropdown(false);
      setSearchResults([]);
    }
  };

  // Add this function to handle search result click
  const handleSearchResultClick = (bookId) => {
    navigate(`/books/${bookId}`);
    setSearchQuery('');
    setShowDropdown(false);
  };

  // Helper to scroll to section on Home page and update hash
  const handleScrollToSection = (sectionId, hash) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        scroller.scrollTo(sectionId, {
          duration: 800,
          delay: 0,
          smooth: 'easeInOutQuart',
          offset: -80
        });
        if (hash) window.location.hash = hash;
      }, 100);
    } else {
      scroller.scrollTo(sectionId, {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart',
        offset: -80
      });
      if (hash) window.location.hash = hash;
    }
  };

  return (
    <header className="w-full bg-white dark:bg-gray-900 dark:text-white shadow-md fixed top-0 left-0 z-50">
      <div className="w-full px-4 py-4">
        <nav className="flex items-center justify-between">
          {/* Left side - Home and Title */}
          <div className="flex items-center gap-4">
            <span
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                if (location.pathname !== '/') {
                  navigate('/');
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    history.replaceState(null, '', '/');
                  }, 100);
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  history.replaceState(null, '', '/');
                }
              }}
            >
              <HiOutlineHome className="size-6" />
            </span>
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-green-800 hover:text-green-900 transition duration-200 dark:text-green-400 dark:hover:text-green-300">
              <span>BookShelf</span>
            </Link>
          </div>

          {/* Hamburger for mobile */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              aria-label="Open menu"
            >
              <HiMenu className="size-7" />
            </button>
          </div>

          {/* Desktop Nav/Search */}
          <div className="hidden md:flex items-center w-full justify-between">
            {/* Middle - Search */}
            <div className="flex-1 max-w-xl mx-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    triggerSearch(searchQuery).then((result) => {
                      if (result.data && result.data.length > 0) {
                        // If book found, navigate to the first result
                        navigate(`/books/${result.data[0]._id}`);
                        setSearchQuery('');
                        setSearchResults([]);
                      } else {
                        // If no books found, navigate to no-results page
                        navigate(`/no-results?q=${encodeURIComponent(searchQuery)}`);
                      }
                    });
                  }
                }}
                className="relative flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search books..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full py-2 pl-10 pr-10 bg-[#EAEAEA] border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                        inputRef.current && inputRef.current.focus();
                      }}
                      aria-label="Clear search"
                    >
                      <IoClose size={20} />
                    </button>
                  )}
                  {searchQuery && showDropdown && searchedBooks && (
                    <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md z-50">
                      {searchedBooks.length > 0 ? (
                        <ul>
                          {searchedBooks.map((book) => (
                            <li
                              key={book._id}
                              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                              onClick={() => handleSearchResultClick(book._id)}
                            >
                              {book.title}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                          No books found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </form>
            </div>
            {/* Right side - Navigation Items */}
            <div className="flex items-center gap-4">
              {currentUser && (
                <>
                  <div className="relative">
                    <button
                      className="text-gray-700 dark:text-gray-300 hover:text-green-800 dark:hover:text-green-400 transition-colors px-2 py-2"
                      onClick={() => setIsDropdownOpen(false) || navigate('/wishlist')}
                      aria-label="Wishlist"
                    >
                      <HiOutlineHeart className="size-6" />
                    </button>
                    {wishlistItems.length > 0 && (
                      <span className="absolute top-0 right-[-2px] text-xs font-bold text-green-700">
                        {wishlistItems.length}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <button
                      className="text-gray-700 dark:text-gray-300 hover:text-green-800 dark:hover:text-green-400 transition-colors px-2 py-2"
                      onClick={() => setIsDropdownOpen(false) || navigate('/cart')}
                      aria-label="Cart"
                    >
                      <HiOutlineShoppingCart className="size-6" />
                    </button>
                    {cartItems.length > 0 && (
                      <span className="absolute top-0 right-[-2px] text-xs font-bold text-green-700">
                        {cartItems.length}
                      </span>
                    )}
                  </div>
                </>
              )}
              <span
                className="text-gray-700 dark:text-gray-300 hover:text-green-800 dark:hover:text-green-400 cursor-pointer transition-colors px-3 py-2"
                onClick={() => navigate('/books')}
              >
                All Books
              </span>
              <Link
                to="#about"
                className="text-gray-700 dark:text-gray-300 hover:text-green-800 dark:hover:text-green-400 transition-colors px-3 py-2"
                onClick={e => { e.preventDefault(); handleScrollToSection('about-section', '#about'); }}
              >
                About Us
              </Link>
              <span
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-green-800 dark:hover:text-green-400 cursor-pointer transition-colors px-3 py-2"
                onClick={() => handleScrollToSection('contact-us-section', '#contact')}
              >
                Contact Us
              </span>
              {currentUser ? (
                <>
                  <Link
                    to="/login"
                    className="bg-[#166534] hover:bg-green-800 text-white font-semibold px-6 py-2 rounded transition-colors duration-200"
                  >
                    Login/Register
                  </Link>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-[#166534] hover:bg-green-800 text-white font-semibold px-6 py-2 rounded transition-colors duration-200"
                >
                  Login/Register
                </Link>
              )}
            </div>
          </div>
        </nav>
      </div>
      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex md:hidden">
          <div className="w-4/5 max-w-xs bg-white dark:bg-gray-900 h-full shadow-lg p-6 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-xl text-green-800 dark:text-green-400">BookShelf</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                aria-label="Close menu"
              >
                <HiX className="size-7" />
              </button>
            </div>
            {/* Mobile Search */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  triggerSearch(searchQuery).then((result) => {
                    if (result.data && result.data.length > 0) {
                      navigate(`/books/${result.data[0]._id}`);
                      setSearchQuery('');
                      setSearchResults([]);
                      setMobileMenuOpen(false);
                    } else {
                      navigate(`/no-results?q=${encodeURIComponent(searchQuery)}`);
                    }
                  });
                }
              }}
              className="relative flex items-center gap-2"
            >
              <div className="relative flex-1">
                <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full py-2 pl-10 pr-10 bg-[#EAEAEA] border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                      inputRef.current && inputRef.current.focus();
                    }}
                    aria-label="Clear search"
                  >
                    <IoClose size={20} />
                  </button>
                )}
                {searchQuery && showDropdown && searchedBooks && (
                  <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md z-50">
                    {searchedBooks.length > 0 ? (
                      <ul>
                        {searchedBooks.map((book) => (
                          <li
                            key={book._id}
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            onClick={() => handleSearchResultClick(book._id)}
                          >
                            {book.title}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                        No books found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>
          {/* Clickable overlay to close menu */}
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)}></div>
        </div>
      )}
    </header>
  );
};

export default Navbar;