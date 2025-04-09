const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { 
  createFine, 
  getAllFines, 
  getUnpaidFines, 
  getFinesByStudent, 
  updateFineStatus, 
  deleteFine 
} = require('../controllers/fineController');
const { authenticateUser, authorizeRole } = require('./middleware/authMiddleware');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/fines';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `fine-payment-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const ext = path.extname(file.originalname).toLowerCase().substring(1);
  
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, PDF, DOC, and DOCX files are allowed'));
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Create a fine (Admin/Librarian only)
router.post(
  '/', 
  authenticateUser, 
  authorizeRole(['admin', 'librarian']), 
  createFine
);

// Get all fines (Admin/Librarian only)
router.get(
  '/', 
  authenticateUser, 
  authorizeRole(['admin', 'librarian']), 
  getAllFines
);

// Get all unpaid fines (Admin/Librarian only)
router.get(
  '/unpaid', 
  authenticateUser, 
  authorizeRole(['admin', 'librarian']), 
  getUnpaidFines
);

// Get fines by student (Admin/Librarian/Student)
router.get(
  '/student/:student_id', 
  authenticateUser, 
  getFinesByStudent
);

// Update fine payment status (Admin/Librarian only)
router.put(
  '/:fine_id', 
  authenticateUser, 
  authorizeRole(['admin', 'librarian']),
  upload.single('payment_document'),
  updateFineStatus
);

// Delete a fine (Admin only)
router.delete(
  '/:fine_id', 
  authenticateUser, 
  authorizeRole(['admin']), 
  deleteFine
);

module.exports = router; 