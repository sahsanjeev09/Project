const express = require('express');
const router = express.Router();
const Reservation = require('../models/reservationModel');
const Book = require('../models/bookModel');
const { authenticateUser, authorizeRole } = require('./middleware/authMiddleware');
const { createReservation } = require('../controllers/reservationController');

// Get reserved count for a book
router.get('/count/:book_id', authenticateUser, async (req, res) => {
  try {
    const { book_id } = req.params;
    const count = await Reservation.countDocuments({
      book_id,
      status: { $in: ['pending', 'approved'] }
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reserved count', error });
  }
});

// Create reservation route
router.post('/', authenticateUser, authorizeRole(['student']), createReservation);

// Get a student's reservations
router.get('/student', authenticateUser, authorizeRole(['student']), async (req, res) => {
  try {
    const student_id = req.user.id;
    const reservations = await Reservation.find({ student_id });
    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ message: 'Error fetching reservations' });
  }
});

// Get all reservations (admin only)
router.get('/', authenticateUser, authorizeRole(['admin', 'librarian']), async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (error) {
    console.error('Error fetching all reservations:', error);
    res.status(500).json({ message: 'Error fetching all reservations' });
  }
});

// Update reservation status (admin only)
router.put('/:id', authenticateUser, authorizeRole(['librarian']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    reservation.status = status;
    await reservation.save();

    res.json({ message: 'Reservation status updated', reservation });
  } catch (error) {
    console.error('Error updating reservation status:', error);
    res.status(500).json({ message: 'Error updating reservation status' });
  }
});

module.exports = router;
