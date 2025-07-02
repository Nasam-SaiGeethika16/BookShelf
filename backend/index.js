const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = process.env.PORT || 5000; 

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cors({
    origin: ['http://localhost:3000', 'https://book-app-frontend-tau.vercel.app'],
    credentials: true
}));
const bookRoutes = require("./src/books/book.route");
const orderRoutes = require("./src/orders/order.route");
const userRoutes = require("./src/users/user.route");
const adminRoutes = require("./src/stats/admin.stats");
const authRoutes = require("./src/auth/auth.route");
const subscriptionRoutes = require("./src/subscriptions/subscription.route");
const contactRoutes = require("./src/contact.route");

app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", subscriptionRoutes);
app.use("/api", contactRoutes);

async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1); 
  }
}

connectDB(); 


app.get("/", (req, res) => {
  res.send("Book Store Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on("error", (err) => {
  console.error(` Failed to start server: ${err.message}`);
});