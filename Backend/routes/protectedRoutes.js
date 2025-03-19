const express = require("express");
const { authenticateUser, authorizeRole } = require("./middleware/authMiddleware");
const router = express.Router();

router.get("/studentDashboard", authenticateUser, authorizeRole(["student"]), (req, res) => {
  res.json({ message: "Welcome to Student Dashboard" });
});

router.get("/adminDashboard", authenticateUser, authorizeRole(["admin"]), (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard" });
});

router.get("/librarianDashboard", authenticateUser, authorizeRole(["librarian"]), (req, res) => {
  res.json({ message: "Welcome to Librarian Dashboard" });
});

module.exports = router;
