const mongoose = require('mongoose');

const borrowingSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  student_name: { type: String, required: true },
  student_email: { type: String, required: true },
  book_name: { type: String, required: true },
  reservation_date: { type: Date, required: true },
  borrow_date: { type: Date },
  due_date: { type: Date },
  return_date: { type: Date },
  fine_amount: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'borrowed', 'returned', 'overdue', 'returned late'],
    default: 'pending'
  },
  reservation_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation', required: true
  }
});

module.exports = mongoose.model('Borrowing', borrowingSchema);
