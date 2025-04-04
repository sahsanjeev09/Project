const Wishlist = require("../models/wishlistModel");
const Book = require("../models/bookModel");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");

// Add to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { book_id, book_name } = req.body;
    const student_name = req.user.name;
    const student_email = req.user.email;

    // Check if book exists
    const book = await Book.findById(book_id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if book is already in wishlist
    const existingWishlist = await Wishlist.findOne({ book_id, student_name });
    if (existingWishlist) {
      return res.status(400).json({ message: "Book already in wishlist" });
    }

    // Create new wishlist entry
    const wishlist = await Wishlist.create({
      book_id,
      student_name,
      student_email,
      book_name,
      status: book.availability ? "available" : "unavailable"
    });

    res.status(201).json({
      status: "success",
      data: {
        wishlist
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

// Get all wishlists (for admin)
exports.getAllWishlists = async (req, res) => {
  try {
    const wishlists = await Wishlist.find()
      .sort({ wishlist_date: -1 });

    res.status(200).json({
      status: "success",
      results: wishlists.length,
      data: {
        wishlists
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

// Update wishlist status when book becomes available
exports.updateWishlistStatus = async (req, res) => {
  try {
    const { book_id } = req.body;

    // Get the book to check availability
    const book = await Book.findById(book_id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!book.availability) {
      return res.status(400).json({ message: "Book is not available" });
    }

    // Find all wishlists for this book
    const wishlists = await Wishlist.find({ book_id, status: "unavailable" });
    if (wishlists.length === 0) {
      return res.status(404).json({ message: "No wishlists found for this book" });
    }

    // Update all wishlists status
    await Wishlist.updateMany(
      { book_id, status: "unavailable" },
      { status: "available" }
    );

    // Send notification emails to students
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    for (const wishlist of wishlists) {
      // Get student email
      const student = await User.findById(wishlist.student_name);
      if (student && student.email) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: student.email,
          subject: "Book Available Notification",
          text: `Dear ${wishlist.student_name},\n\nWe are pleased to inform you that the book "${wishlist.book_name}" you added to your wishlist is now available. Please visit the library to check it out.\n\nRegards,\nLibrary Management System`
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log("Email error:", error);
          } else {
            console.log("Email sent:", info.response);
          }
        });
      }
    }

    res.status(200).json({
      status: "success",
      message: "Wishlist status updated and notifications sent",
      updatedCount: wishlists.length
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

// Get student's own wishlist
exports.getStudentWishlist = async (req, res) => {
  try {
    const student_name = req.user.name;
    
    const wishlists = await Wishlist.find({ student_name })
      .sort({ wishlist_date: -1 });
    
    res.status(200).json({
      status: "success",
      results: wishlists.length,
      data: {
        wishlists
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

// Remove book from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const wishlistId = req.params.wishlistId;
    const student_name = req.user.name;
    
    const wishlist = await Wishlist.findOne({
      _id: wishlistId,
      student_name
    });
    
    if (!wishlist) {
      return res.status(404).json({
        status: "error",
        message: "Wishlist entry not found or you are not authorized"
      });
    }
    
    await Wishlist.findByIdAndDelete(wishlistId);
    
    res.status(200).json({
      status: "success",
      message: "Book removed from wishlist"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

