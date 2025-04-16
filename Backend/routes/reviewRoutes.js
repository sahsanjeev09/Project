// routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateUser } = require('./middleware/authMiddleware');
const {
  addOrUpdateReview,
  getBookReviews,
  getUserReview,
  deleteReview
} = require('../controllers/reviewController');

// Add or update a review
router.post('/', authenticateUser, addOrUpdateReview);

// Get reviews for a book
router.get('/book/:book_id', getBookReviews);

// Get user's review for a specific book
router.get('/user', authenticateUser, getUserReview);

// Delete a review
router.delete('/:review_id', authenticateUser, deleteReview);

module.exports = router;
