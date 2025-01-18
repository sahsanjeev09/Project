const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "student", "librarian"], default: "student" },
  status: { type: String, enum: ["pending", "active", "rejected", "blocked"], default: "pending" }, // Admin verification
});

const User = mongoose.model("User", userSchema);
module.exports = User;

