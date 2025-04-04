const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  student_name: {
    type: String,
    required: true,
  },
  student_email: {
    type: String,
    required: true,
  },
  book_name: {
    type: String,
    required: true,
  },
  wishlist_date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["unavailable", "available"],
    default: "unavailable",
  },
});

module.exports = mongoose.model("Wishlist", wishlistSchema);
