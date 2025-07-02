import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../redux/features/cart/cartSlice';
import { useAuth } from '../../context/AuthContext';
import { useCreateOrderMutation } from '../../redux/features/orders/ordersApi';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { useState as useLocalState } from 'react';

const CheckoutPage = () => {
    const cartItems = useSelector(state => state.cart.cartItems);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [createOrder, { isLoading }] = useCreateOrderMutation();

    const [formData, setFormData] = useState({
        name: '',
        email: currentUser?.email || '',
        phone: '',
        address: {
            city: '',
            country: '',
            state: '',
            zipcode: ''
        }
    });

    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [upiId, setUpiId] = useState('');
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [showRatingPrompt, setShowRatingPrompt] = useLocalState(false);
    const [rating, setRating] = useLocalState(0);
    const [showOrderPlacedModal, setShowOrderPlacedModal] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);

    const totalPrice = cartItems.reduce((acc, item) => acc + item.newPrice * (item.quantity || 1), 0).toFixed(2);

    useEffect(() => {
        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);
    };

    const handleUpiIdChange = (e) => {
        setUpiId(e.target.value);
    };

    const getBackendUrl = () => {
        if (window.location.hostname === 'localhost') {
            return 'http://localhost:5000';
        }
        return window.location.origin;
    };

    const initializeRazorpay = async () => {
        try {
            // Create Razorpay order first
            const response = await fetch(getBackendUrl() + '/api/orders/create-razorpay-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: totalPrice
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create Razorpay order');
            }

            const orderData = await response.json();

            const options = {
                key: 'rzp_test_8DKgnVhK7Ddfpb',
                amount: totalPrice * 100,
                currency: 'INR',
                name: 'BookShelf',
                description: 'Book Purchase',
                order_id: orderData.id,
                handler: function (response) {
                    handlePaymentSuccess(response);
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: {
                    color: '#6366F1'
                },
                modal: {
                    ondismiss: function() {
                        Swal.fire({
                            title: "Payment Cancelled",
                            text: "Your payment was cancelled. Please try again.",
                            icon: "info"
                        });
                    }
                }
            };

            if (paymentMethod === 'upi' && upiId) {
                options.prefill.upi = upiId;
            }

            const rzp = new window.Razorpay(options);
            return rzp;
        } catch (error) {
            console.error('Error initializing Razorpay:', error);
            throw error;
        }
    };

    const handlePaymentSuccess = async (response) => {
        try {
            const orderData = {
                name: formData.name,
                email: formData.email,
                phone: Number(formData.phone),
                address: {
                    city: formData.address.city,
                    country: formData.address.country || undefined,
                    state: formData.address.state || undefined,
                    zipcode: formData.address.zipcode || undefined
                },
                productIds: cartItems.map(item => item._id),
                totalPrice: Number(totalPrice),
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                paymentMethod
            };

            await createOrder(orderData).unwrap();
            dispatch(clearCart());
            setOrderPlaced(true);
            
            setShowOrderPlacedModal(true);
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Failed to process payment. Please try again.",
                icon: "error"
            });
        }
    };

    const handlePlaceOrder = async () => {
        // Validate all required fields
        const requiredFields = {
            name: 'Full Name',
            email: 'Email',
            phone: 'Phone Number',
            'address.city': 'City'
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([field]) => {
                if (field.includes('.')) {
                    const [parent, child] = field.split('.');
                    return !formData[parent]?.[child];
                }
                return !formData[field];
            })
            .map(([_, label]) => label);

        if (missingFields.length > 0) {
            Swal.fire({
                title: "Missing Information",
                text: `Please fill in all required fields: ${missingFields.join(', ')}`,
                icon: "error"
            });
            return;
        }

        if (paymentMethod === 'upi' && !upiId) {
            Swal.fire({
                title: "Missing UPI ID",
                text: "Please enter your UPI ID",
                icon: "error"
            });
            return;
        }

        if (paymentMethod === 'cod') {
            try {
                const orderData = {
                    name: formData.name,
                    email: formData.email,
                    phone: Number(formData.phone),
                    address: {
                        city: formData.address.city,
                        country: formData.address.country || undefined,
                        state: formData.address.state || undefined,
                        zipcode: formData.address.zipcode || undefined
                    },
                    productIds: cartItems.map(item => item._id),
                    totalPrice: Number(totalPrice),
                    paymentMethod
                };

                await createOrder(orderData).unwrap();
                dispatch(clearCart());
                setOrderPlaced(true);
                setShowOrderPlacedModal(true);
            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: "Failed to place order. Please try again.",
                    icon: "error"
                });
            }
        } else {
            try {
                const rzp = await initializeRazorpay();
                rzp.open();
            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: "Failed to initialize payment. Please try again.",
                    icon: "error"
                });
            }
        }
    };

    const handleReviewSubmit = (star) => {
        setRating(star);
        setShowRatingModal(false);
        toast.success(`You rated your order ${star} star${star > 1 ? 's' : ''}!`, { icon: '⭐', style: { color: '#16a34a' } });
        navigate('/');
    };

    const handleSkipReview = () => {
        setShowRatingModal(false);
        navigate('/');
    };

    if (isLoading) {
        return (
            <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Processing your order...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-200px)] w-full pl-2 pr-2 sm:pl-12 sm:pr-6 py-6 sm:py-8 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <div className="flex mt-8 sm:mt-12 h-full flex-col overflow-hidden bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 sm:py-6">
                        <div className="mt-6 sm:mt-8">
                            <div className="flow-root">
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Checkout</h2>
                                
                                {/* Shipping Information */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-gray-900 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-900 mb-2">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-900 mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                                                placeholder="+91 1234567890"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Address Information */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-gray-900 mb-2">City</label>
                                            <input
                                                type="text"
                                                name="address.city"
                                                value={formData.address.city}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                                                placeholder="City"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-gray-900 mb-2">Country</label>
                                                <input
                                                    type="text"
                                                    name="address.country"
                                                    value={formData.address.country}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                                                    placeholder="Country"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-900 mb-2">State</label>
                                                <input
                                                    type="text"
                                                    name="address.state"
                                                    value={formData.address.state}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                                                    placeholder="State"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-gray-900 mb-2">Zipcode</label>
                                            <input
                                                type="text"
                                                name="address.zipcode"
                                                value={formData.address.zipcode}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                                                placeholder="12345"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method Selection */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Choose Payment Method</h3>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => handlePaymentMethodChange('cod')}
                                            className={`px-4 py-2 rounded-md ${
                                                paymentMethod === 'cod'
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                                            }`}
                                        >
                                            Cash on Delivery (COD)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handlePaymentMethodChange('upi')}
                                            className={`px-4 py-2 rounded-md ${
                                                paymentMethod === 'upi'
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                                            }`}
                                        >
                                            UPI Payment
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handlePaymentMethodChange('card')}
                                            className={`px-4 py-2 rounded-md ${
                                                paymentMethod === 'card'
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                                            }`}
                                        >
                                            Card Payment
                                        </button>
                                    </div>
                                </div>

                                {/* UPI ID Input */}
                                {paymentMethod === 'upi' && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Enter UPI ID</h3>
                                        <div>
                                            <input
                                                type="text"
                                                value={upiId}
                                                onChange={handleUpiIdChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                                                placeholder="example@upi"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">For test payments, use <b>success@razorpay</b> as your UPI ID.</p>
                                    </div>
                                )}

                                {/* Order Summary */}
                                <div className="border-t border-gray-200 pt-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                                    <div className="space-y-4">
                                        {cartItems.map((item) => (
                                            <div key={item._id} className="flex justify-between">
                                                <span className="text-gray-900">{item.title} x {item.quantity || 1}</span>
                                                <span className="text-gray-900">₹{item.newPrice * (item.quantity || 1)}</span>
                                            </div>
                                        ))}
                                        <div className="border-t border-gray-200 pt-4">
                                            <div className="flex justify-between font-medium">
                                                <span className="text-gray-900">Total</span>
                                                <span className="text-gray-900">₹{totalPrice}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <button
                            onClick={handlePlaceOrder}
                            className="w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                        >
                            {paymentMethod === 'cod' ? 'Place Order' : `Pay ₹${totalPrice}`}
                        </button>
                    </div>
                </div>
            </div>
            {showOrderPlacedModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-2xl flex flex-col items-center max-w-md w-full">
                        <div className="flex flex-col items-center mb-4">
                            <svg width="64" height="64" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#e6f4ea"/><path d="M7 13l3 3 7-7" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            <h2 className="text-2xl font-bold mt-2 mb-1 text-center">Order Placed Successfully!</h2>
                            <p className="text-gray-600 mb-4 text-center">Thank you for your purchase.</p>
                        </div>
                        <button
                            onClick={() => { setShowOrderPlacedModal(false); setShowRatingModal(true); }}
                            className="mt-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold"
                        >
                            Rate your order
                        </button>
                    </div>
                </div>
            )}
            {showRatingModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-2xl flex flex-col items-center max-w-md w-full">
                        <span className="text-lg font-semibold mb-2 text-green-700">Please rate your order:</span>
                        <div className="flex gap-2 mb-4">
                            {[1,2,3,4,5].map(star => (
                                <button
                                    key={star}
                                    onClick={() => handleReviewSubmit(star)}
                                    className={`text-3xl ${star <= rating ? 'text-green-600' : 'text-gray-300'}`}
                                >
                                    ⭐
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleSkipReview}
                            className="mt-2 px-6 py-2 bg-gray-200 text-gray-900 rounded font-semibold"
                        >
                            Skip
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;