// const cron = require('node-cron');
// const Reservation = require('../models/reservationModel');
// const Book = require('../models/bookModel');
// const { sendStatusUpdateEmail } = require('../utils/email');

// // Schedule the task to run every day at midnight
// cron.schedule('0 0 * * *', async () => {
//   try {
//     const twentyFourHoursAgo = new Date();
//     twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);

//     const expiredReservations = await Reservation.find({
//       reservation_date: { $lte: twentyFourHoursAgo },
//       status: 'approved'
//     });

//     for (const reservation of expiredReservations) {
//       const book = await Book.findById(reservation.book_id);
//       if (book) {
//         book.Available_count += 1;
//         await book.save();
//       }

//       reservation.status = 'rejected';
//       await reservation.save();

//       // Send email notification for reservation expiration
//       const subject = 'Reservation Expired';
//       const text = `Dear ${reservation.student_name}, your reservation for ${reservation.book_name} has expired. Thank you!`;
//       await sendStatusUpdateEmail(reservation.student_email, subject, text);
//     }

//     console.log('Expired reservations processed');
//   } catch (error) {
//     console.error('Error processing expired reservations:', error);
//   }
// });


// cronJobs/cronJobs.js
const cron = require('node-cron');
const Reservation = require('../models/reservationModel');
const Book = require('../models/bookModel');
const { sendStatusUpdateEmail } = require('../utils/email');

// Schedule the task to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);

    const expiredReservations = await Reservation.find({
      reservation_date: { $lte: twentyFourHoursAgo },
      status: 'approved'
    });

    for (const reservation of expiredReservations) {
      const book = await Book.findById(reservation.book_id);
      if (book) {
        book.Available_count += 1;
        await book.save();
      }

      reservation.status = 'rejected';
      await reservation.save();

      // Send email notification for reservation expiration
      const subject = 'Reservation Expired';
      const text = `Dear ${reservation.student_name}, your reservation for ${reservation.book_name} has expired. Thank you!`;
      await sendStatusUpdateEmail(reservation.student_email, subject, text);
    }

    console.log('Expired reservations processed');
  } catch (error) {
    console.error('Error processing expired reservations:', error);
  }
});
