import React from 'react'
import { FiShoppingCart } from "react-icons/fi"
import { useParams } from "react-router-dom"
import { FaHeart } from 'react-icons/fa';

import { getImgUrl } from '../../utils/getImgUrl';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { useFetchBookByIdQuery } from '../../redux/features/books/booksApi';
import { addToWishlist } from '../../redux/features/wishlist/wishlistSlice';

const SingleBook = () => {
    const {id} = useParams();
    const {data: book, isLoading, isError} = useFetchBookByIdQuery(id);

    const dispatch = useDispatch();

    const handleAddToCart = (product) => {
        dispatch(addToCart(product))
    }

    const handleAddToWishlist = () => {
        dispatch(addToWishlist(book));
    };

    if(isLoading) return <div>Loading...</div>
    if(isError) return <div>Error happening to load book info</div>
    
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-2 py-8">
            <div className="max-w-4xl w-full mx-auto shadow-2xl p-0 bg-white rounded-lg flex flex-col md:flex-row overflow-hidden">
                {/* Left: Image and Wishlist */}
                <div className="relative flex-shrink-0 flex items-center justify-center bg-white md:w-1/2 p-8">
                    <img
                        src={`${getImgUrl(book.coverImage)}`}
                        alt={book.title}
                        className="h-[400px] w-auto object-contain mx-auto"
                    />
                    <button 
                        onClick={handleAddToWishlist} 
                        className="absolute top-6 right-6 p-3 rounded-full bg-white shadow hover:bg-gray-100 transition-colors z-10"
                        aria-label="Add to wishlist"
                    >
                        <FaHeart className="text-red-500 text-2xl" />
                    </button>
                </div>
                {/* Right: Info and Add to Cart */}
                <div className="flex-1 flex flex-col justify-center p-8">
                    <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{book.title}</h1>
                    <div className="mb-6 space-y-2">
                        <p className="text-gray-700 dark:text-gray-300"><strong>Author:</strong> {book.author || 'admin'}</p>
                        <p className="text-gray-700 dark:text-gray-300"><strong>Published:</strong> {book.publishedDate ? new Date(book.publishedDate).getFullYear() : 'N/A'}</p>
                        <p className="text-gray-700 capitalize dark:text-gray-300"><strong>Category:</strong> {book?.category}</p>
                        <p className="text-gray-700 dark:text-gray-300"><strong>Description:</strong> {book.description}</p>
                    </div>
                    <button 
                        onClick={() => handleAddToCart(book)} 
                        className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded text-lg flex items-center gap-2 transition-colors dark:bg-green-600 dark:hover:bg-green-700 w-full md:w-auto justify-center mt-4"
                    >
                        <FiShoppingCart className="text-2xl" />
                        <span>Add to Cart</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SingleBook