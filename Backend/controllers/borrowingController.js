const Borrowing = require('../models/borrowingModel');
const Reservation = require('../models/reservationModel');
const Book = require('../models/bookModel');
const { sendStatusUpdateEmail } = require('../utils/email');

exports.getApprovedReservations = async (req, res) => {
  try {
    const approvedReservations = await Reservation.find({ status: 'approved' });
    const borrowings = await Borrowing.find();

    // Create a map to track reservations by their IDs
    const reservationMap = new Map();

    // Add approved reservations to the map
    approvedReservations.forEach(res => {
      reservationMap.set(res._id.toString(), {
        _id: res._id,
        student_name: res.student_name,
        student_email: res.student_email,
        book_name: res.book_name,
        reservation_date: res.reservation_date,
        status: 'pending',
        type: 'reservation'
      });
    });

    // Add borrowings to the map, overwriting any existing reservations
    borrowings.forEach(bor => {
      reservationMap.set(bor.reservation_id.toString(), {
        _id: bor._id,
        student_id: bor.student_id,
        student_name: bor.student_name,
        student_email: bor.student_email,
        book_name: bor.book_name,
        reservation_date: bor.reservation_date,
        borrow_date: bor.borrow_date,
        due_date: bor.due_date,
        return_date: bor.return_date,
        fine_amount: bor.fine_amount,
        status: bor.status,
        type: 'borrowing'
      });
    });

    // Convert the map to an array and sort by reservation date
    const combinedData = Array.from(reservationMap.values()).sort((a, b) => new Date(b.reservation_date) - new Date(a.reservation_date));

    res.status(200).json(combinedData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// exports.getBorrowingById = async (req, res) => {
//   try {
//     const borrowing = await Borrowing.findById(req.params.id);
//     if (!borrowing) return res.status(404).json({ message: 'Borrowing not found' });

//     res.status(200).json(borrowing);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// Get specific borrowing by ID
exports.getBorrowingById = async (req, res) => {
  try {
    const borrowing = await Borrowing.findById(req.params.id)
      .populate('student_id', 'name email')
      .populate('reservation_id');

    if (!borrowing) {
      return res.status(404).json({ message: 'Borrowing not found' });
    }

    res.status(200).json(borrowing);
  } catch (error) {
    console.error('Error fetching borrowing by ID:', error);
    res.status(500).json({
      message: 'Error fetching borrowing',
      error: error.message
    });
  }
};

// exports.getBorrowingsByUser = async (req, res) => {
//   try {
//     const student_id = req.user.id;
//     const borrowings = await Borrowing.find({ student_id }).sort({ borrow_date: -1 });
//     res.status(200).json(borrowings);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// Get borrowings for a specific student
// exports.getBorrowingsByUser = async (req, res) => {
//   try {
//     console.log('Fetching borrowings for user:', req.user);

//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ message: 'Unauthorized - User not authenticated' });
//     }

//     const student_id = req.user.id;
//     console.log('Searching for borrowings with student_id:', student_id);

//     // First verify the student exists in the database
//     const student = await User.findById(student_id);
//     if (!student) {
//       return res.status(404).json({ message: 'Student not found' });
//     }

//     const borrowings = await Borrowing.find({ student_id })
//       .sort({ borrow_date: -1 })
//       .populate('student_id', 'name email')
//       .populate('reservation_id');

//     console.log('Found borrowings:', borrowings.length);

//     if (!borrowings.length) {
//       return res.status(404).json({ message: 'No borrowings found for this user' });
//     }

//     res.status(200).json(borrowings);
//   } catch (error) {
//     console.error('Detailed error in getBorrowingsByUser:', error);
//     res.status(500).json({
//       message: 'Error fetching borrowings',
//       error: error.message,
//       stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//     });
//   }
// };

// Get borrowings for a specific student
exports.getBorrowingsByUser = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized - User not authenticated' });
    }

    const student_id = req.user.id;
    const borrowings = await Borrowing.find({ student_id })
      .sort({ borrow_date: -1 });

    if (!borrowings.length) {
      return res.status(404).json({ message: 'No borrowings found for this user' });
    }

    res.status(200).json(borrowings);
  } catch (error) {
    console.error('Error in getBorrowingsByUser:', error);
    res.status(500).json({
      message: 'Error fetching borrowings',
      error: error.message
    });
  }
};

exports.createBorrowing = async (req, res) => {
  try {
    const { reservation_id } = req.body;
    console.log('Creating borrowing for reservation ID:', reservation_id); // Log the reservation ID

    const reservation = await Reservation.findById(reservation_id);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    if (reservation.status !== 'approved') return res.status(400).json({ message: 'Reservation is not approved' });

    const existingBorrowing = await Borrowing.findOne({ reservation_id });
    if (existingBorrowing) return res.status(400).json({ message: 'Borrowing already exists' });

    const borrowDate = new Date();
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + 7);

    const book = await Book.findOne({ Book_Name: reservation.book_name });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.Available_count <= 0) return res.status(400).json({ message: 'Book is not available' });

    const borrowing = new Borrowing({
      student_id: reservation.student_id,
      student_name: reservation.student_name,
      student_email: reservation.student_email,
      book_name: reservation.book_name,
      reservation_date: reservation.reservation_date,
      borrow_date: borrowDate,
      due_date: dueDate,
      fine_amount: 0,
      status: 'borrowed',
      reservation_id: reservation._id
    });

    await borrowing.save();
    book.Available_count -= 1;
    await book.save();

    reservation.status = 'borrowed';
    await reservation.save();

    // Send email notification
    const subject = 'Book Borrowed';
    const text = `Dear ${reservation.student_name}, you have successfully borrowed ${book.Book_Name} for 7 days. Thank you!`;
    await sendStatusUpdateEmail(reservation.student_email, subject, text);

    res.status(201).json({ message: 'Borrowing created successfully', borrowing });
  } catch (error) {
    console.error('Error creating borrowing:', error); // Log the error
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateBorrowDate = async (req, res) => {
  try {
    const { borrowing_id } = req.params;
    const borrowing = await Borrowing.findById(borrowing_id);
    
    if (!borrowing) return res.status(404).json({ message: 'Borrowing not found' });

    const borrowDate = new Date();
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + 7);

    borrowing.borrow_date = borrowDate;
    borrowing.due_date = dueDate;
    borrowing.status = 'borrowed';

    await borrowing.save();

    const reservation = await Reservation.findById(borrowing.reservation_id);
    if (reservation) {
      // const book = await Book.findOne({ Book_Name: reservation.book_name });
      // if (book) {
      //   book.Available_count = Math.max(0, book.Available_count - 1);
      //   await book.save();
      // }
    }

    res.status(200).json({ message: 'Borrow date updated', borrowing });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// exports.returnBook = async (req, res) => {
//   try {
//     const { borrowing_id } = req.params;

//     const borrowing = await Borrowing.findById(borrowing_id);
//     if (!borrowing) return res.status(404).json({ message: 'Borrowing not found' });
//     if (['returned', 'returned late'].includes(borrowing.status)) {
//       return res.status(400).json({ message: 'Book already returned' });
//     }

//     const returnDate = new Date();
//     borrowing.return_date = returnDate;

//     if (returnDate > borrowing.due_date) {
//       const daysLate = Math.ceil((returnDate - borrowing.due_date) / (1000 * 60 * 60 * 24));
//       borrowing.fine_amount = daysLate * 15;
//       borrowing.status = 'returned late';

//       // Send email notification for late return
//       const subject = 'Late Return Notice';
//       const text = `Dear ${borrowing.student_name}, you have returned ${borrowing.book_name} late. You have been fined Rs. ${borrowing.fine_amount}. Make sure you have paid it. Thank you!`;
//       await sendStatusUpdateEmail(borrowing.student_email, subject, text);
//     } else {
//       borrowing.fine_amount = 0;
//       borrowing.status = 'returned';

//       // Send email notification for on-time return
//       const subject = 'Book Returned';
//       const text = `Dear ${borrowing.student_name}, you have successfully returned ${borrowing.book_name}. Please go for another one. Thank you!`;
//       await sendStatusUpdateEmail(borrowing.student_email, subject, text);
//     }

//     await borrowing.save();

//     const book = await Book.findOne({ Book_Name: borrowing.book_name });
//     if (book) {
//       book.Available_count += 1;
//       await book.save();
//     }

//     const reservation = await Reservation.findById(borrowing.reservation_id);
//     if (reservation) {
//       reservation.status = borrowing.status;
//       await reservation.save();
//     }

//     res.status(200).json({
//       message: 'Book returned successfully',
//       fine: borrowing.fine_amount ? `Rs ${borrowing.fine_amount}` : 'No fine',
//       borrowing
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

exports.returnBook = async (req, res) => {
  try {
    const { borrowing_id } = req.params;

    const borrowing = await Borrowing.findById(borrowing_id);
    if (!borrowing) return res.status(404).json({ message: 'Borrowing not found' });
    if (['returned', 'returned late'].includes(borrowing.status)) {
      return res.status(400).json({ message: 'Book already returned' });
    }

    const returnDate = new Date();
    borrowing.return_date = returnDate;

    if (returnDate > borrowing.due_date) {
      const daysLate = Math.ceil((returnDate - borrowing.due_date) / (1000 * 60 * 60 * 24));
      borrowing.fine_amount = daysLate * 15;
      borrowing.status = 'returned late';

      // Send email notification for late return
      const subject = 'Late Return Notice';
      const text = `Dear ${borrowing.student_name}, you have returned ${borrowing.book_name} late. You have been fined Rs. ${borrowing.fine_amount}. Make sure you have paid it. Thank you!`;
      await sendStatusUpdateEmail(borrowing.student_email, subject, text);
    } else {
      borrowing.fine_amount = 0;
      borrowing.status = 'returned';

      // Send email notification for on-time return
      const subject = 'Book Returned';
      const text = `Dear ${borrowing.student_name}, you have successfully returned ${borrowing.book_name}. Please go for another one. Thank you!`;
      await sendStatusUpdateEmail(borrowing.student_email, subject, text);
    }

    await borrowing.save();

    const book = await Book.findOne({ Book_Name: borrowing.book_name });
    if (book) {
      book.Available_count += 1;
      await book.save();
    }

    const reservation = await Reservation.findById(borrowing.reservation_id);
    if (reservation) {
      reservation.status = borrowing.status;
      await reservation.save();
    }

    res.status(200).json({
      message: 'Book returned successfully',
      fine: borrowing.fine_amount ? `Rs ${borrowing.fine_amount}` : 'No fine',
      borrowing
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.checkOverdue = async (req, res) => {
  try {
    const borrowings = await Borrowing.find({ status: 'borrowed' });
    const currentDate = new Date();

    for (const borrowing of borrowings) {
      if (currentDate > borrowing.due_date && !borrowing.return_date) {
        borrowing.status = 'overdue';
        await borrowing.save();

        const reservation = await Reservation.findById(borrowing.reservation_id);
        if (reservation) {
          reservation.status = 'overdue';
          await reservation.save();
        }   

        // Send email notification for overdue
        const subject = 'Overdue Notice';
        const text = `Dear ${borrowing.student_name}, your due has been gone for ${borrowing.book_name}. Please return it as soon as possible to avoid penalty. Thank you!`;
        await sendStatusUpdateEmail(borrowing.student_email, subject, text);
      }
    }

    res.status(200).json({ message: 'Overdue status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// exports.getAllBorrowings = async (req, res) => {
//   try {
//     const { status } = req.query;
//     const filter = status && status !== 'all' ? { status } : {};
//     const borrowings = await Borrowing.find(filter).sort({ borrow_date: -1 });
//     res.status(200).json(borrowings);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// Get all borrowings (admin/librarian only)
exports.getAllBorrowings = async (req, res) => {
  try {
    const borrowings = await Borrowing.find()
      .sort({ borrow_date: -1 })
      .populate('student_id', 'name email')
      .populate('reservation_id');

    res.status(200).json(borrowings);
  } catch (error) {
    console.error('Error fetching all borrowings:', error);
    res.status(500).json({
      message: 'Error fetching all borrowings',
      error: error.message
    });
  }
};

exports.searchBorrowingsByStudent = async (req, res) => {
  try {
    const { studentName } = req.query;
    if (!studentName) return res.status(400).json({ message: 'Student name is required' });

    const borrowings = await Borrowing.find({
      student_name: { $regex: studentName, $options: 'i' }
    }).sort({ borrow_date: -1 });

    res.status(200).json(borrowings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// controllers/borrowingController.js
// ... your existing imports

exports.checkReviewEligibility = async (req, res) => {
  try {
    const { user_id, book_id } = req.params;

    // Check if user has borrowed and returned this book
    const borrowing = await Borrowing.findOne({
      student_id: user_id,
      book_name: book_id,
      status: { $in: ['returned', 'returned late'] }
    });

    res.status(200).json({
      canReview: !!borrowing
    });
  } catch (error) {
    console.error('Error checking review eligibility:', error);
    res.status(500).json({
      message: 'Error checking review eligibility',
      error: error.message
    });
  }
};
