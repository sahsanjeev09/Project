// const mongoose = require('mongoose');

// const reservationSchema = new mongoose.Schema({
//   book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
//   book_name: { type: String, required: true },
//   student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   student_name: { type: String, required: true },
//   reservation_date: { type: Date, default: Date.now },
//   status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
// });

// const Reservation = mongoose.model('Reservation', reservationSchema);
// module.exports = Reservation;


// const mongoose = require('mongoose');

// const reservationSchema = new mongoose.Schema({
//   book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
//   book_name: { type: String, required: true },
//   student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   student_name: { type: String, required: true },
//   student_email: { type: String, required: true },
//   reservation_date: { type: Date, default: Date.now },
//   status: { type: String, enum: ['pending', 'approved', 'rejected', 'borrowed'], default: 'pending' }
// });

// module.exports = mongoose.model('Reservation', reservationSchema);


const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  book_name: { type: String, required: true },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  student_name: { type: String, required: true },
  student_email: { type: String, required: true },
  reservation_date: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'borrowed'], default: 'pending' }
});

module.exports = mongoose.model('Reservation', reservationSchema);
