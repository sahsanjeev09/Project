// controllers/reviewController.js
const Review = require('../models/reviewModel');
const Borrowing = require('../models/borrowingModel');
const Book = require('../models/bookModel');
const User = require('../models/userModel');

// Add or update a review
exports.addOrUpdateReview = async (req, res) => {
  try {
    const { book_id, rating, review_text } = req.body;
    const student_id = req.user.id;

    // Check if student has borrowed and returned this book
    const borrowing = await Borrowing.findOne({
      student_id,
      book_name: book_id,
      status: { $in: ['returned', 'returned late'] }
    });

    if (!borrowing) {
      return res.status(403).json({
        message: 'You can only review books you have borrowed and returned'
      });
    }

    // Find existing review or create new one
    let review = await Review.findOne({
      book_id,
      student_id
    });

    if (!review) {
      review = new Review({
        book_id,
        student_id,
        rating,
        review_text
      });
    } else {
      review.rating = rating;
      review.review_text = review_text;
    }

    await review.save();

    // Update book's average rating
    const reviews = await Review.find({ book_id });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Book.findByIdAndUpdate(book_id, {
      average_rating: averageRating,
      review_count: reviews.length
    });

    // Get user data with profile image for response
    const user = await User.findById(student_id).select('name profileImage');

    res.status(200).json({
      message: review._id ? 'Review updated successfully' : 'Review added successfully',
      review: {
        ...review.toObject(),
        student_id: {
          _id: user._id,
          name: user.name,
          profileImage: user.profileImage
        }
      }
    });
  } catch (error) {
    console.error('Error adding/updating review:', error);
    res.status(500).json({
      message: 'Error adding/updating review',
      error: error.message
    });
  }
};

// Get reviews for a book
exports.getBookReviews = async (req, res) => {
  try {
    const { book_id } = req.params;
    const { page = 1, limit = 5 } = req.query;

    const reviews = await Review.find({ book_id })
      .populate('student_id', 'name profileImage')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Review.countDocuments({ book_id });

    res.status(200).json({
      reviews,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching book reviews:', error);
    res.status(500).json({
      message: 'Error fetching book reviews',
      error: error.message
    });
  }
};

// Get user's review for a specific book
exports.getUserReview = async (req, res) => {
  try {
    const { book_id } = req.query;
    const student_id = req.user.id;

    const review = await Review.findOne({
      book_id,
      student_id
    }).populate('student_id', 'name profileImage');

    res.status(200).json(review || {});
  } catch (error) {
    console.error('Error fetching user review:', error);
    res.status(500).json({
      message: 'Error fetching user review',
      error: error.message
    });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { review_id } = req.params;
    const student_id = req.user.id;

    const review = await Review.findOneAndDelete({
      _id: review_id,
      student_id
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Update book's average rating
    const reviews = await Review.find({ book_id: review.book_id });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    await Book.findByIdAndUpdate(review.book_id, {
      average_rating: averageRating,
      review_count: reviews.length
    });

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      message: 'Error deleting review',
      error: error.message
    });
  }
};
