import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyBorrowings.css';

const MyBorrowings = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Retrieve user data from local storage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      setToken(user.token);
    } else {
      setError('User not logged in.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchBorrowings = async () => {
      if (!token) {
        setError('User not logged in.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get('/api/borrowings/student', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBorrowings(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching borrowings:', err);
        setError('Failed to load borrowings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowings();
  }, [token]);

  const filteredBorrowings = statusFilter === 'all'
    ? borrowings
    : borrowings.filter(bor => bor.status === statusFilter);

  const getStatusClass = (status) => {
    switch(status) {
      case 'borrowed': return 'status-borrowed';
      case 'returned': return 'status-returned';
      case 'overdue': return 'status-overdue';
      case 'returned late': return 'status-returned-late';
      default: return '';
    }
  };

  if (loading) return <div className="loading">Loading borrowings...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="borrowing-details-container">
      <h2>My Borrowings</h2>

      {filteredBorrowings.length > 0 ? (
        <div className="table-container">
          <table className="borrowings-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Book Name</th>
                <th>Reservation Date</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Fine Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBorrowings.map((borrowing) => (
                <tr key={borrowing._id}>
                  <td>{borrowing.student_name}</td>
                  <td>{borrowing.book_name}</td>
                  <td>{new Date(borrowing.reservation_date).toLocaleDateString()}</td>
                  <td>{borrowing.borrow_date ? new Date(borrowing.borrow_date).toLocaleDateString() : '-'}</td>
                  <td>{borrowing.due_date ? new Date(borrowing.due_date).toLocaleDateString() : '-'}</td>
                  <td>{borrowing.return_date ? new Date(borrowing.return_date).toLocaleDateString() : '-'}</td>
                  <td>Rs. {borrowing.fine_amount || 0}</td>
                  <td className={getStatusClass(borrowing.status)}>
                    {borrowing.status.charAt(0).toUpperCase() + borrowing.status.slice(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-data">No borrowings found</div>
      )}
    </div>
  );
};

export default MyBorrowings;
