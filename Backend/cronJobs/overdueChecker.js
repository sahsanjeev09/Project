const cron = require('node-cron');
const Borrowing = require('../models/borrowingModel');
const transporter = require('../config/nodemailer');

// Schedule the job to run daily at 8 AM
cron.schedule('0 8 * * *', async () => {
  try {
    const today = new Date();
    const overdueBorrowings = await Borrowing.find({
      status: { $in: ['borrowed', 'pending'] },
      due_date: { $lt: today },
    });

    for (const borrowing of overdueBorrowings) {
      borrowing.status = 'overdue';
      borrowing.fine = borrowing.calculateFine();
      await borrowing.save();

      // Send email notification
      const mailOptions = {
        from: 'library@example.com',
        to: borrowing.student_email,
        subject: 'Overdue Book Notice',
        text: `Dear ${borrowing.student_name},\n\nYour borrowed book "${borrowing.book_name}" is overdue since ${borrowing.due_date.toDateString()}. Please return it as soon as possible. Your current fine is Rs. ${borrowing.fine}.\n\nThank you.`,
      };

      await transporter.sendMail(mailOptions);
    }

    console.log('Overdue check completed and notifications sent.');
  } catch (error) {
    console.error('Error during overdue check:', error);
  }
});



