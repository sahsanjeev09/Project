const express = require('express');
const multer = require('multer');
const path = require('path');
const Book = require('../models/bookModel');
const { getBookById } = require('../controllers/bookController');
const router = express.Router();

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Add a New Book
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { Book_Name, Author, ISBN, Category, Description, Book_Location, Publisher, PublishedDate, Available_count } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const Image = `/uploads/${req.file.filename}`; // Store image path

    const newBook = new Book({
      Book_Name,
      Author,
      ISBN,
      Category,
      Description,
      Book_Location,
      Publisher, 
      PublishedDate,
      Available_count,
      Image,
    });

    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    console.error('Error adding book:', err);
    res.status(500).json({ message: 'Failed to add book', details: err.message });
  }
});

// Get All Books
//Perfectly working for admin
router.get('/all', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ message: 'Failed to fetch books', details: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const totalBooks = await Book.countDocuments();
    const books = await Book.find().skip(skip).limit(limit);

    res.json({
      books,
      totalPages: Math.ceil(totalBooks / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ message: 'Failed to fetch books', details: err.message });
  }
});

// Get a Single Book by ID
router.get('/:id', getBookById);

// Update a Book
// router.put('/:id', upload.single('image'), async (req, res) => {
//   try {
//     const { Book_Name, Author, ISBN, Category, Description, Book_Location, Publisher, PublishedDate, Available_count } = req.body;

//     let updatedBook = {
//       Book_Name,
//       Author,
//       ISBN,
//       Category,
//       Description,
//       Book_Location,
//       Publisher, 
//       PublishedDate,
//       Available_count,
//       Image,
//     };

//     if (req.file) {
//       updatedBook.Image = `/uploads/${req.file.filename}`;
//     }

//     const book = await Book.findByIdAndUpdate(req.params.id, updatedBook, { new: true });

//     if (!book) {
//       return res.status(404).json({ message: 'Book not found' });
//     }

//     res.json(book);
//   } catch (err) {
//     console.error('Error updating book:', err);
//     res.status(500).json({ message: 'Failed to update book', details: err.message });
//   }
// });

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { Book_Name, Author, ISBN, Category, Description, Book_Location, Publisher, PublishedDate, Available_count } = req.body;

    // First, find the existing book
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Update fields (only if provided, else keep old)
    book.Book_Name = Book_Name || book.Book_Name;
    book.Author = Author || book.Author;
    book.ISBN = ISBN || book.ISBN;
    book.Category = Category || book.Category;
    book.Description = Description || book.Description;
    book.Book_Location = Book_Location || book.Book_Location;
    book.Publisher = Publisher || book.Publisher;
    book.PublishedDate = PublishedDate || book.PublishedDate;
    book.Available_count = Available_count || book.Available_count;

    // Update image only if a new file is uploaded
    if (req.file) {
      book.Image = `/uploads/${req.file.filename}`;
    }

    const updatedBook = await book.save();

    res.json(updatedBook);

  } catch (err) {
    console.error('Error updating book:', err);
    res.status(500).json({ message: 'Failed to update book', details: err.message });
  }
});

// Delete a Book
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error('Error deleting book:', err);
    res.status(500).json({ message: 'Failed to delete book', details: err.message });
  }
});

// Serve Static Files (Images)
router.use('/uploads', express.static('uploads'));

module.exports = router;
