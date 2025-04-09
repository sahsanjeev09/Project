const mongoose = require('mongoose');

const fineSchema = new mongoose.Schema({
  borrowing_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Borrowing',
    required: true 
  },
  student_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  student_name: { type: String, required: true },
  book_name: { type: String, required: true },
  amount: { type: Number, required: true },
  due_date: { type: Date },
  return_date: { type: Date },
  payment_status: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' },
  payment_date: { type: Date },
  payment_method: { type: String },
  receipt_number: { type: String },
  payment_document: { type: String },
  remarks: { type: String }
}, { timestamps: true });

// Compound index to prevent duplicate entries
fineSchema.index({ borrowing_id: 1 }, { unique: true });

module.exports = mongoose.model('Fine', fineSchema);
