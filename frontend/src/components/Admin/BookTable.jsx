import React from 'react';

const BookTable = ({ books = [], handleEdit, handleDelete }) => {
  return (
    <table className="books-table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Book Name</th>
          <th>Author</th>
          <th>Description</th>
          <th>ISBN</th>
          <th>Location</th>
          <th>Available Count</th>
          <th>Category</th>
          <th>Publisher</th>
          <th>Published Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {books.map((book) => (
          <tr key={book._id}>
            <td><img src={`http://localhost:3000${book.Image}`} alt={book.Book_Name} className="image-cell" /></td>
            <td>{book.Book_Name}</td>
            <td>{book.Author}</td>
            <td>{book.Description}</td>
            <td>{book.ISBN}</td>
            <td>{book.Book_Location}</td>
            <td>{book.Available_count}</td>
            <td>{book.Category}</td>
            <td>{book.Publisher}</td>
            <td>{book.PublishedDate}</td>
            <td className="actions-cell">
              <button className="edit-btn" onClick={() => handleEdit(book)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(book._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BookTable;
