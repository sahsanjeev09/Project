const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Signup Route
exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const status = "pending"; // Set status to pending by default

    const newUser = new User({ name, email, password: hashedPassword, role, status });
    await newUser.save();

    if (role === "student") {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpVerification = new OTPVerification({
        userId: newUser._id,
        email: newUser.email,
        otpCode: otp,
        createdAt: Date.now(),
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      });

      await otpVerification.save();
      await sendOTPEmail(newUser.email, otp);

      return res.status(201).json({ message: "OTP sent for verification", userId: newUser._id });
    } else {
      return res.status(201).json({ message: "Account created successfully." });
    }
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify OTP Route
exports.verifyOTP = async (req, res) => {
  const { userId, otp } = req.body;
  try {
    const otpVerification = await OTPVerification.findOne({ userId });
    if (!otpVerification) return res.status(400).json({ message: "Invalid OTP" });

    if (otpVerification.otpCode !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (otpVerification.expiresAt < Date.now()) return res.status(400).json({ message: "OTP expired" });

    // Update user status to pending
    const user = await User.findById(userId);
    user.status = "pending";
    await user.save();

    await OTPVerification.findByIdAndDelete(otpVerification._id);

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Forgot Password Route
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpVerification = new OTPVerification({
      userId: user._id,
      email: user.email,
      otpCode: otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    await otpVerification.save();
    await sendOTPEmail(user.email, otp);

    res.status(200).json({ message: "OTP sent for password reset" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset Password Route
exports.resetPassword = async (req, res) => {
  const { userId, otp, newPassword } = req.body;
  try {
    const otpVerification = await OTPVerification.findOne({ userId });
    if (!otpVerification) return res.status(400).json({ message: "Invalid OTP" });

    if (otpVerification.otpCode !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (otpVerification.expiresAt < Date.now()) return res.status(400).json({ message: "OTP expired" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findById(userId);
    user.password = hashedPassword;
    await user.save();

    await OTPVerification.findByIdAndDelete(otpVerification._id);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login Route
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User does not exist" });
    if (user.status !== "active") return res.status(403).json({ message: "Account not approved" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
    });

    res.json({
      message: "Login successful",
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Logout Route
exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", { path: '/', secure: process.env.NODE_ENV === 'production' });
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.approveUser = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = status;
    await user.save();

    const subject = status === "active" ? "Account Verified" : status === "blocked" ? "Account Blocked" : "Account Not Verified";
    const text =
      status === "active"
        ? `Dear ${user.name}, your account has been successfully created. Please go through the login process to access your dashboard. Thank you!`
        : status === "blocked"
        ? `Dear ${user.name}, your account has been blocked. Please visit the library department for inquiry. Thank you!`
        : `Dear ${user.name}, your account creation has been rejected due to wrong credentials. Please signup again or visit the library department for inquiry. Thank you!`;

    await sendStatusUpdateEmail(user.email, subject, text);

    res.status(200).json({ message: "Status updated successfully" });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Get all students with role 'student'
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    res.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update student status
exports.updateStudentStatus = async (req, res) => {
  const { studentID, status } = req.body;

  try {
    const student = await User.findById(studentID);
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.status = status;
    await student.save();

    res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createReservation = async (req, res) => {
  const { studentId, studentName, bookId, bookName, reservationDate, status } = req.body;

  try {
    const student = await User.findById(studentId);
    const book = await Book.findById(bookId);

    if (!student || !book) {
      return res.status(404).json({ message: "Student or Book not found" });
    }

    const recentReservations = await Reservation.find({
      studentId: studentId,
      reservationDate: { $gte: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
      status: "reserved",
    });

    if (recentReservations.length >= 2) {
      return res.status(400).json({ message: "You have already reserved 2 books in the last 15 days" });
    }

    const reservation = new Reservation({
      studentName,
      studentId,
      bookName,
      bookId,
      reservationDate: reservationDate || new Date(),
      status: status || "pending",
    });

    await reservation.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: student.email,
      subject: "Book Reservation Confirmation",
      text: `Dear ${student.name}, your reservation for the book "${book.Book_Name}" is pending.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Failed to send email" });
      }
      console.log("Email sent:", info.response);
      res.status(201).json({ message: "Reservation created successfully", reservation });
    });
  } catch (err) {
    console.error("Error creating reservation:", err);
    res.status(500).json({ message: "Server error" });
  }
};
