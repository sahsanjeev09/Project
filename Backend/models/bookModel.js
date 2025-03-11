const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  Book_Name: { type: String, required: true },
  Author: { type: String, required: true },
  ISBN: { type: String, required: true },
  Category: { type: String, required: true },
  Description: { type: String, required: true },
  Book_Location: { type: String, required: true },
  Publisher: { type: String, required: true },
  PublishedDate: { type: String, required: true },
  Available_count: {
    type: Number,
    default: 1,
    min: [0, 'Available count cannot be negative']
  },
  Image: { type: String, required: true },
  average_rating: {
    type: Number,
    default: 0
  },
  review_count: {
    type: Number,
    default: 0
  }
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
