const User = require("../models/userModel");

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
