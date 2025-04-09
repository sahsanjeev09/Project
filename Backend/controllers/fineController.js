const Fine = require('../models/fineModel');
const Borrowing = require('../models/borrowingModel');
const User = require('../models/userModel');
const fs = require('fs');
const path = require('path');

// Create a fine entry when a book is returned late
exports.createFine = async (req, res) => {
  try {
    const { borrowing_id } = req.body;
    
    // Check if fine already exists for this borrowing
    const existingFine = await Fine.findOne({ borrowing_id });
    if (existingFine) {
      return res.status(400).json({ 
        message: 'Fine already exists for this borrowing record',
        fine: existingFine
      });
    }
    
    // Get the borrowing record
    const borrowing = await Borrowing.findById(borrowing_id);
    if (!borrowing) {
      return res.status(404).json({ message: 'Borrowing record not found' });
    }
    
    // Calculate fine if not already calculated
    let fineAmount = borrowing.fine_amount || 0;
    
    // If no fine_amount but returned late, calculate it
    if (fineAmount === 0 && borrowing.return_date && borrowing.due_date && 
        new Date(borrowing.return_date) > new Date(borrowing.due_date)) {
      const diffTime = Math.abs(new Date(borrowing.return_date) - new Date(borrowing.due_date));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fineAmount = diffDays * 15; // Rs 15 per day
      
      // Update the borrowing record with the calculated fine
      borrowing.fine_amount = fineAmount;
      await borrowing.save();
    }
    
    // Ensure the borrowing has a fine amount
    if (fineAmount <= 0) {
      return res.status(400).json({ message: 'No fine to be created for this borrowing' });
    }
    
    // Create the fine entry
    const fine = new Fine({
      borrowing_id: borrowing._id,
      student_id: borrowing.student_id || null,
      student_name: borrowing.student_name,
      book_name: borrowing.book_name,
      amount: fineAmount,
      due_date: borrowing.due_date,
      return_date: borrowing.return_date,
      payment_status: 'unpaid'
    });
    
    await fine.save();
    
    res.status(201).json({
      message: 'Fine created successfully',
      fine
    });
    
  } catch (error) {
    console.error('Error creating fine:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all fines
exports.getAllFines = async (req, res) => {
  try {
    const fines = await Fine.find().sort({ createdAt: -1 });
    res.status(200).json(fines);
  } catch (error) {
    console.error('Error fetching fines:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get unpaid fines
exports.getUnpaidFines = async (req, res) => {
  try {
    const fines = await Fine.find({ payment_status: 'unpaid' }).sort({ createdAt: -1 });
    res.status(200).json(fines);
  } catch (error) {
    console.error('Error fetching unpaid fines:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get fines by student ID
exports.getFinesByStudent = async (req, res) => {
  try {
    const { student_id } = req.params;
    const fines = await Fine.find({ student_id }).sort({ createdAt: -1 });
    res.status(200).json(fines);
  } catch (error) {
    console.error('Error fetching student fines:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update fine payment status
exports.updateFineStatus = async (req, res) => {
  try {
    const { fine_id } = req.params;
    const { 
      payment_status, 
      payment_date, 
      payment_method, 
      receipt_number,
      remarks 
    } = req.body;
    
    const fine = await Fine.findById(fine_id);
    if (!fine) {
      return res.status(404).json({ message: 'Fine not found' });
    }
    
    // Update payment fields
    fine.payment_status = payment_status || fine.payment_status;
    
    if (payment_status === 'paid') {
      fine.payment_date = payment_date ? new Date(payment_date) : new Date();
      fine.payment_method = payment_method || 'cash';
      fine.receipt_number = receipt_number || '';
      
      // Handle document upload
      if (req.file) {
        // Delete previous document if exists
        if (fine.payment_document) {
          const oldFilePath = path.join(__dirname, '..', fine.payment_document);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
        // Save new document path
        fine.payment_document = `/${req.file.path.replace(/\\/g, '/')}`;
      }
    }
    
    if (remarks) {
      fine.remarks = remarks;
    }
    
    await fine.save();
    
    res.status(200).json({
      message: 'Fine status updated successfully',
      fine
    });
    
  } catch (error) {
    console.error('Error updating fine status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a fine
exports.deleteFine = async (req, res) => {
  try {
    const { fine_id } = req.params;
    
    const fine = await Fine.findById(fine_id);
    if (!fine) {
      return res.status(404).json({ message: 'Fine not found' });
    }
    
    // Delete associated document if exists
    if (fine.payment_document) {
      const filePath = path.join(__dirname, '..', fine.payment_document);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await Fine.findByIdAndDelete(fine_id);
    
    res.status(200).json({
      message: 'Fine deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting fine:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 