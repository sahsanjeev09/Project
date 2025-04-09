const express = require('express');
const router = express.Router();
const {
  createBorrowing,
  getAllBorrowings,
  getBorrowingById,
  getApprovedReservations,
  updateBorrowDate,
  returnBook,
  searchBorrowingsByStudent,
  checkOverdue,
  getBorrowingsByUser,
  checkReviewEligibility
} = require('../controllers/borrowingController');
const { authenticateUser, authorizeRole } = require('./middleware/authMiddleware');

// Get borrowings for the logged-in student (specific user)
router.get('/student', authenticateUser, authorizeRole(['student']), getBorrowingsByUser);

// Get all borrowings (admin/librarian only)
router.get('/', authenticateUser, authorizeRole(['admin', 'librarian']), getAllBorrowings);

// Get approved reservations (for librarian/admin) - MOVED BEFORE :id
router.get('/approved-reservations', authenticateUser, authorizeRole(['librarian', 'admin']), getApprovedReservations);

// Search borrowings by student name (admin/librarian)
router.get('/search', authenticateUser, authorizeRole(['admin', 'librarian']), searchBorrowingsByStudent);

// Get specific borrowing by ID - MOVED AFTER MORE SPECIFIC ROUTES
router.get('/:id', authenticateUser, getBorrowingById);

// Create a new borrowing
router.post('/', authenticateUser, authorizeRole(['student']), createBorrowing);

// Return a book
router.put('/return/:borrowing_id', authenticateUser, authorizeRole(['student']), returnBook);

// Update borrow date
router.put('/update-date/:borrowing_id', authenticateUser, updateBorrowDate);

// Check for overdue books
router.patch('/check-overdue', authenticateUser, checkOverdue);

// Check if user can review a specific book
router.get('/user/:user_id/book/:book_id', authenticateUser, authorizeRole(['student']), checkReviewEligibility);


module.exports = router;
