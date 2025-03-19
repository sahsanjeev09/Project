const express = require('express');
const { getAllStudents, updateStudentStatus } = require('../controllers/studentController');
const { authenticateUser, authorizeRole } = require('./middleware/authMiddleware');
const router = express.Router();

// Route to get all students 
router.get('/', authenticateUser, authorizeRole(['admin', 'librarian']), getAllStudents);

// Route to update student status
router.post('/update-status', authenticateUser, authorizeRole(['admin']), updateStudentStatus);

module.exports = router;
