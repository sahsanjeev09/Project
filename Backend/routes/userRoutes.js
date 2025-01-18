


const express = require('express');
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const router = express.Router();

// Route to get all users (accessible by admin only)
router.get('/', authenticateUser, authorizeRole(['admin']), getAllUsers);

// Route to get a single user by ID (accessible by admin only)
router.get('/:id', authenticateUser, authorizeRole(['admin']), getUserById);

// Route to update user profile (accessible by admin only)
router.put('/:id', authenticateUser, authorizeRole(['admin']), updateUser);

// Route to delete user (accessible by admin only)
router.delete('/:id', authenticateUser, authorizeRole(['admin']), deleteUser);

// Route to upload profile image (accessible by authenticated users)
router.post('/:id/profile-image', authenticateUser);

module.exports = router;
