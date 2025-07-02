import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getImgUrl } from '../../utils/getImgUrl';
import { clearCart, removeFromCart, incrementQuantity, decrementQuantity } from '../../redux/features/cart/cartSlice';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const cartItems = useSelector(state => state.cart.cartItems);
    const dispatch =  useDispatch()
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const totalPrice =  cartItems.reduce((acc, item) => acc + item.newPrice * (item.quantity || 1), 0).toFixed(2);

    const handleRemoveFromCart = (product) => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        dispatch(removeFromCart(product))
    }

    const handleClearCart  = () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        dispatch(clearCart())
    }

    return (
        <div className="min-h-[calc(100vh-200px)] w-full pl-4 pr-2 sm:pl-12 sm:pr-6 py-8 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <div className="flex mt-12 h-full flex-col overflow-hidden bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                            <div className="text-lg font-medium text-gray-900">Shopping cart</div>
                            <div className="ml-3 flex h-7 items-center ">
                                <button
                                    type="button"
                                    onClick={handleClearCart }
                                    className="relative -m-2 py-1 px-2 bg-red-500 text-white rounded-md hover:bg-secondary transition-all duration-200  "
                                >
                                    <span className="">Clear Cart</span>
                                </button>
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="flow-root">
                                {
                                    cartItems.length > 0 ? (
                                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                                            {
                                                cartItems.map((product) => (
                                                    <li key={product?._id} className="flex py-6">
                                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                            <img
                                                                alt=""
                                                                src={`${getImgUrl(product?.coverImage)}`}
                                                                className="h-full w-full object-cover object-center"
                                                            />
                                                        </div>

                                                        <div className="ml-4 flex flex-1 flex-col">
                                                            <div>
                                                                <div className="flex flex-wrap justify-between text-base font-medium text-gray-900">
                                                                    <h3>
                                                                        <Link to='/'>{product?.title}</Link>
                                                                    </h3>
                                                                    <p className="sm:ml-4">₹{product?.newPrice}</p>
                                                                </div>
                                                                <p className="mt-1 text-sm text-gray-500 capitalize"><strong>Category: </strong>{product?.category}</p>
                                                            </div>
                                                            <div className="flex flex-1 flex-wrap items-end justify-between space-y-2 text-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                      onClick={() => dispatch(decrementQuantity(product._id))}
                                                                      className="px-2 py-1 bg-gray-200 rounded text-lg font-bold hover:bg-gray-300"
                                                                    >-</button>
                                                                    <span className="px-2 text-gray-900">{product.quantity || 1}</span>
                                                                    <button
                                                                      onClick={() => dispatch(incrementQuantity(product._id))}
                                                                      className="px-2 py-1 bg-gray-200 rounded text-lg font-bold hover:bg-gray-300"
                                                                    >+</button>
                                                                </div>

                                                                <div className="flex">
                                                                    <button
                                                                    onClick={() => handleRemoveFromCart(product)}
                                                                    type="button" className="font-medium text-indigo-600 hover:text-indigo-500">
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    ) : (
                                        <div className="text-center py-12">
                                            <p className="text-gray-600 dark:text-gray-400 text-lg">No products found!</p>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                            <p>Subtotal</p>
                            <p>₹{totalPrice ? totalPrice : 0}</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                        <div className="mt-6">
                            <Link
                                to="/checkout"
                                className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                            >
                                Checkout
                            </Link>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                            <Link to="/">
                                or
                                <button
                                    type="button"
                                    className="font-medium text-indigo-600 hover:text-indigo-500 ml-1"
                                >
                                    Continue Shopping
                                    <span aria-hidden="true"> &rarr;</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartPage