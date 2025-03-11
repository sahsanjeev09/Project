const Book = require('../models/bookModel');

// Get book details by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (err) {
    console.error('Error fetching book details:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
