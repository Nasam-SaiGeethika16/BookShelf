import React, { useState } from 'react'
import { useGetOrderByEmailQuery } from '../../redux/features/orders/ordersApi'
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const OrderPage = () => {
    const { currentUser} = useAuth()


    const { data: orders = [], isLoading, isError } = useGetOrderByEmailQuery(currentUser.email);
    // Always declare hooks at the top
    const [reviewed, setReviewed] = useState(false);
    const [rating, setRating] = useState(0);

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error geting orders data</div>

    // Show oldest first (latest last)
    const sortedOrders = [...orders].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const latestOrder = sortedOrders.length > 0 ? sortedOrders[sortedOrders.length - 1] : null;

    const handleStarClick = (star) => {
        setRating(star);
        setReviewed(true);
        toast.success(`You rated your order ${star} star${star > 1 ? 's' : ''}!`, { icon: '⭐', style: { color: '#16a34a' } });
    };

    return (
        <div className='container mx-auto p-6'>
            <h2 className='text-2xl font-semibold mb-4'>Your Orders</h2>
            {
                sortedOrders.length === 0 ? (<div>No orders found!</div>) : (<div>
                    {
                        sortedOrders.map((order, index) => (
                            <div key={order._id} className="border-b mb-4 pb-4">
                                <p className='p-1 bg-secondary text-white w-10 rounded mb-1'># {index + 1}</p>
                                <h2 className="font-bold">Order ID: {order._id}</h2>
                                <p className="text-gray-600">Name: {order.name}</p>
                                <p className="text-gray-600">Email: {order.email}</p>
                                <p className="text-gray-600">Phone: {order.phone}</p>
                                <p className="text-gray-600">Total Price: ₹{order.totalPrice}</p>
                                <h3 className="font-semibold mt-2">Address:</h3>
                                <p> {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}</p>
                                <h3 className="font-semibold mt-2">Products Id:</h3>
                                <ul>
                                    {order.productIds.map((productId) => (
                                        <li key={productId}>{productId}</li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    }
                </div>)
            }
        </div>
    )
}

export default OrderPage