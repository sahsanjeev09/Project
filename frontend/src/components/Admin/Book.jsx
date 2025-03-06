import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookForm from './BookForm';
import BookTable from './BookTable';
import Pagination from './Pagination';
import './Book.css';

const Book = () => {
  const [formData, setFormData] = useState({
    Book_Name: '', Author: '', Description: '', ISBN: '',
    Book_Location: '', Available_count: '', Category: '',
    Publisher: '', PublishedDate: ''
  });
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentBookId, setCurrentBookId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const booksPerPage = 5;

  const fetchBooks = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3000/api/books?page=${page}`);
      setBooks(res.data.books);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
    } catch (err) {
      toast.error('Error fetching books. Try again!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const resetForm = () => {
    setFormData({
      Book_Name: '', Author: '', Description: '', ISBN: '',
      Book_Location: '', Available_count: '', Category: '',
      Publisher: '', PublishedDate: ''
    });
    setEditMode(false);
    setSelectedFile(null);
    setPreviewURL('');
    setCurrentBookId(null);
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      if (formData[key]) data.append(key, formData[key]);
    }
    if (selectedFile) data.append('image', selectedFile);

    try {
      if (editMode) {
        await axios.put(`http://localhost:3000/api/books/${currentBookId}`, data);
        toast.success('Book updated successfully!');
      } else {
        await axios.post('http://localhost:3000/api/books/all', data);
        toast.success('Book added successfully!');
      }
      resetForm();
      fetchBooks(currentPage);
    } catch (error) {
      toast.error('Error saving book. Try again!');
    }
  };

  const handleEdit = (book) => {
    setFormData(book);
    setPreviewURL(book.Image);
    setEditMode(true);
    setCurrentBookId(book._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/books/${id}`);
      toast.success('Book deleted successfully!');
      fetchBooks(currentPage);
    } catch (error) {
      toast.error('Error deleting book!');
    }
  };

  return (
    <div className="books-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>{editMode ? 'Edit Book' : 'Add New Book'}</h2>
      <BookForm
        formData={formData}
        setFormData={setFormData}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        previewURL={previewURL}
        setPreviewURL={setPreviewURL}
        handleSubmit={handleAddOrUpdate}
        editMode={editMode}
      />
      <h2>Books List</h2>
      {loading ? <p>Loading...</p> : (
        <>
          <BookTable books={books} handleEdit={handleEdit} handleDelete={handleDelete} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={fetchBooks}
          />
        </>
      )}
    </div>
  );
};

export default Book;
