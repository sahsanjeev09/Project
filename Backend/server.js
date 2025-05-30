const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/mongodb");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const studentRoutes = require("./routes/studentRoutes");
const bookRoutes = require('./routes/bookRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const borrowingRoutes = require('./routes/borrowingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const fineRoutes = require('./routes/fineRoutes');
const path = require('path');
require('dotenv').config();
require('./cronJobs/cronJobs'); // Ensure this line is present

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

// Database Connection
connectDB();

// Serve Static Files (For Image Uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/students", studentRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/borrowings', borrowingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/fines', fineRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Server Listening
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
