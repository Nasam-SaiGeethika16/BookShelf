const Order = require("./order.model");
const Book = require("../books/book.model");
const Razorpay = require('razorpay');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: 'rzp_test_8DKgnVhK7Ddfpb',
    key_secret: 'H3vMhAyMatAGoH4ErQeX6SSC'
});

const createRazorpayOrder = async (req, res) => {
    try {
        console.log('Received request to /api/orders/create-razorpay-order:', req.body);
        const { amount } = req.body;
        const options = {
            amount: amount * 100, // amount in smallest currency unit
            currency: "INR",
            receipt: "receipt_" + Date.now(),
        };

        const order = await razorpay.orders.create(options);
        console.log('Razorpay order created:', order);
        res.status(200).json(order);
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ message: error.message });
    }
};

const createAOrder = async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      paymentStatus: req.body.paymentMethod === 'cod' ? 'pending' : 'completed'
    };
    const order = await Order.create(orderData);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const orders = await Order.find({ email }).sort({ createdAt: -1 });
    if (!orders) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAOrder,
  getOrderByEmail,
  createRazorpayOrder
};
