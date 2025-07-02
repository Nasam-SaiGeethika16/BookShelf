import React from 'react'
import { FiShoppingCart } from 'react-icons/fi'
import { getImgUrl } from '../../utils/getImgUrl'
import { FaHeart } from 'react-icons/fa'
import { Link } from'react-router-dom'
import { useDispatch, useSelector } from'react-redux'
import { addToCart, incrementQuantity, decrementQuantity } from '../../redux/features/cart/cartSlice'
import { addToWishlist } from '../../redux/features/wishlist/wishlistSlice'
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { HiHeart } from 'react-icons/hi'
import toast from 'react-hot-toast';

const BookCard = ({book, fullWidth}) => {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.cartItems);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleAddToCart = (product) => {
        if (!currentUser) {
            toast.error('Please log in to add items to your cart.');
            navigate('/login');
            return;
        }
        const alreadyInCart = cartItems.some(item => item._id === product._id);
        if (alreadyInCart) {
            dispatch({ type: 'cart/showNotification', payload: 'Already in cart!' });
        } else {
            dispatch(addToCart(product));
            dispatch({ type: 'cart/showNotification', payload: 'Added to cart!' });
        }
    }

    const handleAddToWishlist = () => {
        if (!currentUser) {
            toast.error('Please log in to add items to your wishlist.');
            navigate('/login');
            return;
        }
        dispatch(addToWishlist(book));
    };

    const cartItem = cartItems.find(item => item._id === book._id);

    return (
        <div className={`rounded-lg transition-shadow duration-300 bg-white dark:bg-gray-800 dark:border-gray-700 border border-gray-200 ${fullWidth ? 'w-full' : 'max-w-sm'} mx-auto relative shadow-2xl hover:shadow-2xl overflow-hidden`}>
            {/* Wishlist Heart Icon at top-right */}
            <button
                onClick={handleAddToWishlist}
                className="absolute top-3 right-3 bg-white dark:bg-gray-700 p-2 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors z-10"
                aria-label="Add to Wishlist"
            >
                <FaHeart className="text-red-500" />
            </button>
            <div className="flex flex-col md:flex-row gap-4 p-3 sm:p-4 w-full">
                <div className="w-full md:w-44 h-48 md:h-64 flex-shrink-0 border border-gray-200 dark:border-gray-600 rounded-md overflow-hidden flex items-center justify-center bg-white dark:bg-gray-700">
                    <Link to={`/books/${book._id}`} className="w-full h-full flex items-center justify-center">
                        <img
                            src={`${getImgUrl(book?.coverImage)}`}
                            alt={book?.title}
                            className="w-full h-full object-cover rounded-t-lg md:rounded-t-none md:rounded-l-lg cursor-pointer hover:scale-105 transition-all duration-200 bg-white dark:bg-gray-700"
                        />
                    </Link>
                </div>
                <div className="flex-1 w-full flex flex-col justify-between">
                    <Link to={`/books/${book._id}`}>
                        <h3 className="text-lg sm:text-xl font-semibold hover:text-blue-600 mb-2 sm:mb-3 text-gray-900 dark:text-white">
                            {book?.title}
                        </h3>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 sm:mb-5 text-sm sm:text-base line-clamp-3">
                        {book?.description.length > 80 ? `${book.description.slice(0, 80)}...` : book?.description}
                    </p>
                    <p className="font-medium mb-3 sm:mb-5 text-gray-900 dark:text-white text-base sm:text-lg">
                        ₹{book?.newPrice} <span className="line-through font-normal ml-2 text-gray-500 dark:text-gray-400">₹ {book?.oldPrice}</span>
                    </p>
                    {cartItem ? (
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => dispatch(decrementQuantity(book._id))}
                                    className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white"
                                >-</button>
                                <span className="px-2 text-gray-900 dark:text-white">{cartItem.quantity}</span>
                                <button
                                    onClick={() => dispatch(incrementQuantity(book._id))}
                                    className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white"
                                >+</button>
                            </div>
                            <Link to="/cart" className="bg-green-800 hover:bg-green-900 text-white px-4 sm:px-6 py-2 rounded flex items-center gap-2 whitespace-nowrap transition duration-200 dark:bg-green-700 dark:hover:bg-green-900 justify-center text-sm sm:text-base">
                                View Cart
                            </Link>
                        </div>
                    ) : (
                        <button 
                            onClick={() => handleAddToCart(book)}
                            className="bg-green-800 hover:bg-green-900 text-white px-4 sm:px-6 py-2 rounded flex items-center gap-2 whitespace-nowrap transition duration-200 dark:bg-green-700 dark:hover:bg-green-900 w-full sm:w-auto text-sm sm:text-base"
                        >
                            <FiShoppingCart />
                            <span>Add to Cart</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BookCard