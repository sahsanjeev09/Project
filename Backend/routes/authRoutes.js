const express = require("express");
const { signup, login, approveUser, logout, verifyOTP, forgotPassword, resetPassword } = require("../controllers/authController");
const { authenticateUser } = require("./middleware/authMiddleware");
const User = require("../models/userModel");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-otp", verifyOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.put("/approve/:id", approveUser);

router.get("/users", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ message: "Authenticated", user });
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;