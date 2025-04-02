// const Reservation = require('../models/reservationModel');
// const Book = require('../models/bookModel');

// const createReservation = async (req, res) => {
//   try {
//     const { book_id, book_name, student_name, student_email } = req.body;

//     // Check if the book is available
//     const book = await Book.findById(book_id);
//     if (!book || book.Available_count <= 0) {
//       return res.status(400).json({ message: 'Book is unavailable for reservation' });
//     }

//     const fifteenDaysAgo = new Date();
//     fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

//     const recentReservations = await Reservation.find({
//       student_name,
//       reservation_date: { $gte: fifteenDaysAgo },
//       status: { $in: ['pending', 'approved'] }
//     });

//     const status = recentReservations.length < 2 ? 'approved' : 'rejected';

//     const reservation = new Reservation({
//       book_id,
//       book_name,
//       student_name,
//       student_email,
//       status
//     });

//     await reservation.save();
//     res.status(201).json({ message: 'Reservation submitted successfully', reservation });
//   } catch (error) {
//     res.status(500).json({ message: 'Error making reservation', error });
//   }
// };

// module.exports = { createReservation };

// const Reservation = require('../models/reservationModel');
// const Book = require('../models/bookModel');
// const { sendStatusUpdateEmail } = require('../utils/email'); // Ensure you have an email utility function

// const createReservation = async (req, res) => {
//   try {
//     const { book_id, book_name, student_name, student_email, student_id } = req.body;

//     // Check if the book is available
//     const book = await Book.findById(book_id);
//     if (!book || book.Available_count <= 0) {
//       return res.status(400).json({ message: 'Book is unavailable for reservation' });
//     }

//     const fifteenDaysAgo = new Date();
//     fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

//     const recentReservations = await Reservation.find({
//       student_id,
//       reservation_date: { $gte: fifteenDaysAgo },
//       status: { $in: ['pending', 'approved'] }
//     });

//     const status = recentReservations.length < 2 ? 'approved' : 'rejected';

//     const reservation = new Reservation({
//       book_id,
//       book_name,
//       student_id,
//       student_name,
//       student_email,
//       status
//     });

//     await reservation.save();

//     // Send email notification based on the status
//     const subject = status === 'approved'
//       ? `Reservation Approved`
//       : `Reservation Rejected`;

//     const text = status === 'approved'
//       ? `Dear ${student_name}, you have successfully reserved ${book_name} for 24 hours. Please borrow it within time. Thank you!`
//       : `Dear ${student_name}, your reservation for ${book_name} has been rejected due to library terms and conditions for reserving two books only within 15 days. Please try later. Thank you!`;

//     await sendStatusUpdateEmail(student_email, subject, text);

//     res.status(201).json({ message: 'Reservation submitted successfully', reservation });
//   } catch (error) {
//     console.error('Error creating reservation:', error); // Log the error
//     res.status(500).json({ message: 'Error making reservation', error });
//   }
// };

// module.exports = { createReservation };



// const Reservation = require('../models/reservationModel');
// const Book = require('../models/bookModel');
// const { sendStatusUpdateEmail } = require('../utils/email'); // Ensure you have an email utility function

// const createReservation = async (req, res) => {
//   try {
//     const { book_id, book_name, student_name, student_email, student_id } = req.body;

//     // Check if the book is available
//     const book = await Book.findById(book_id);
//     if (!book || book.Available_count <= 0) {
//       return res.status(400).json({ message: 'Book is unavailable for reservation' });
//     }

//     const fifteenDaysAgo = new Date();
//     fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

//     // Check if the student already has two approved or borrowed reservations within the last 15 days
//     const recentReservations = await Reservation.find({
//       student_id,
//       reservation_date: { $gte: fifteenDaysAgo },
//       status: { $in: ['approved', 'borrowed'] }
//     });

//     if (recentReservations.length >= 2) {
//       return res.status(400).json({ message: 'You have already reserved or borrowed the maximum number of books within the last 15 days.' });
//     }

//     // Check if the student already has a reservation for the same book
//     const existingReservation = await Reservation.findOne({
//       student_id,
//       book_id,
//       reservation_date: { $gte: fifteenDaysAgo },
//       status: { $in: ['pending', 'approved'] }
//     });

//     if (existingReservation) {
//       return res.status(400).json({ message: 'You have already reserved this book within the last 15 days.' });
//     }

//     const status = recentReservations.length < 2 ? 'approved' : 'rejected';

//     const reservation = new Reservation({
//       book_id,
//       book_name,
//       student_id,
//       student_name,
//       student_email,
//       status
//     });

//     await reservation.save();

//     if (status === 'approved') {
//       book.Available_count -= 1;
//       await book.save();
//     }

//     // Send email notification based on the status
//     const subject = status === 'approved'
//       ? `Reservation Approved`
//       : `Reservation Rejected`;

//     const text = status === 'approved'
//       ? `Dear ${student_name}, you have successfully reserved ${book_name} for 24 hours. Please borrow it within time. Thank you!`
//       : `Dear ${student_name}, your reservation for ${book_name} has been rejected due to library terms and conditions for reserving two books only within 15 days. Please try later. Thank you!`;

//     await sendStatusUpdateEmail(student_email, subject, text);

//     res.status(201).json({ message: 'Reservation submitted successfully', reservation });
//   } catch (error) {
//     console.error('Error creating reservation:', error); // Log the error
//     res.status(500).json({ message: 'Error making reservation', error });
//   }
// };

// module.exports = { createReservation };



//5/7/2025 auto rejection ko lagi
// controllers/reservationController.js
const Reservation = require('../models/reservationModel');
const Book = require('../models/bookModel');
const { sendStatusUpdateEmail } = require('../utils/email');

const createReservation = async (req, res) => {
  try {
    const { book_id, book_name, student_name, student_email, student_id } = req.body;

    // Check if the book is available
    const book = await Book.findById(book_id);
    if (!book || book.Available_count <= 0) {
      return res.status(400).json({ message: 'Book is unavailable for reservation' });
    }

    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

    // Check if the student already has two approved or borrowed reservations within the last 15 days
    const recentReservations = await Reservation.find({
      student_id,
      reservation_date: { $gte: fifteenDaysAgo },
      status: { $in: ['approved', 'borrowed'] }
    });

    if (recentReservations.length >= 2) {
      return res.status(400).json({ message: 'You have already reserved or borrowed the maximum number of books within the last 15 days.' });
    }

    // Check if the student already has a reservation for the same book
    const existingReservation = await Reservation.findOne({
      student_id,
      book_id,
      reservation_date: { $gte: fifteenDaysAgo },
      status: { $in: ['pending', 'approved'] }
    });

    if (existingReservation) {
      return res.status(400).json({ message: 'You have already reserved this book within the last 15 days.' });
    }

    const status = recentReservations.length < 2 ? 'approved' : 'rejected';

    const reservation = new Reservation({
      book_id,
      book_name,
      student_id,
      student_name,
      student_email,
      status
    });

    await reservation.save();

    if (status === 'approved') {
      book.Available_count -= 1;
      await book.save();
    }

    // Send email notification based on the status
    const subject = status === 'approved'
      ? `Reservation Approved`
      : `Reservation Rejected`;

    const text = status === 'approved'
      ? `Dear ${student_name}, you have successfully reserved ${book_name} for 24 hours. Please borrow it within time. Thank you!`
      : `Dear ${student_name}, your reservation for ${book_name} has been rejected due to library terms and conditions for reserving two books only within 15 days. Please try later. Thank you!`;

    await sendStatusUpdateEmail(student_email, subject, text);

    res.status(201).json({ message: 'Reservation submitted successfully', reservation });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ message: 'Error making reservation', error });
  }
};

module.exports = { createReservation };
