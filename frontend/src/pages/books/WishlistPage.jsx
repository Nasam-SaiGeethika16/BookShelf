import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromWishlist } from '../../redux/features/wishlist/wishlistSlice';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { getImgUrl } from '../../utils/getImgUrl';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const WishlistPage = () => {
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Get display name or fallback to email/username
  const userName = currentUser?.displayName || currentUser?.username || currentUser?.email?.split('@')[0] || 'User';
  const isAdmin = currentUser?.role === 'admin';

  const handleRemoveFromWishlist = (book) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    dispatch(removeFromWishlist(book));
  };

  const handleAddToCart = (book) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    dispatch(addToCart(book));
    dispatch(removeFromWishlist(book)); // Optionally remove from wishlist after adding to cart
  };

  return (
    <div className="min-h-[calc(100vh-200px)] w-full pl-4 pr-2 sm:pl-12 sm:pr-6 py-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{userName}'s Wishlist</h1>
        {wishlistItems.length > 0 ? (
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <table className="w-full border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-600 text-left text-gray-900 dark:text-white">#</th>
                  <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-600 text-left text-gray-900 dark:text-white">Cover</th>
                  <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-600 text-left text-gray-900 dark:text-white">Title</th>
                  {isAdmin && <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-600 text-left text-gray-900 dark:text-white">Quantity</th>}
                  {isAdmin && <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-600 text-left text-gray-900 dark:text-white">Ordered</th>}
                  <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-600 text-left text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {wishlistItems.map((item, idx) => (
                  <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                    <td className="px-4 py-4 text-gray-900 dark:text-white">{idx + 1}</td>
                    <td className="px-4 py-4">
                      <img src={getImgUrl(item.coverImage)} alt={item.title} className="h-16 w-12 object-contain mx-auto rounded shadow" />
                    </td>
                    <td className="px-4 py-4 font-semibold text-lg text-gray-900 dark:text-white">{item.title}</td>
                    {isAdmin && <td className="px-4 py-4 text-gray-900 dark:text-white">--</td>}
                    {isAdmin && <td className="px-4 py-4 text-gray-900 dark:text-white">--</td>}
                    <td className="px-4 py-4">
                      <div className="flex flex-row gap-2 items-center justify-center">
                        <button 
                          onClick={() => handleRemoveFromWishlist(item)} 
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-semibold transition-colors"
                        >
                          Remove
                        </button>
                        <button 
                          onClick={() => handleAddToCart(item)} 
                          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded text-sm font-semibold transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">Your wishlist is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage; 