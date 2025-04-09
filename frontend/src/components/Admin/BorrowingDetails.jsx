import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './borrowing.css';

const BorrowingDetails = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredBorrowings, setFilteredBorrowings] = useState([]);
  
  // Fetch all borrowings on component mount
  useEffect(() => {
    fetchBorrowings();
  }, []);

  // Apply filters when data or filters change
  useEffect(() => {
    applyFilters();
  }, [borrowings, searchQuery, statusFilter]);

  // Fetch borrowings data
  const fetchBorrowings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/borrowings', {
        withCredentials: true
      });
      setBorrowings(response.data);
      setFilteredBorrowings(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching borrowings:', err);
      setError('Failed to load borrowings. Please try again later.');
      setLoading(false);
    }
  };

  // Apply filters to borrowings
  const applyFilters = () => {
    let filtered = [...borrowings];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(borrowing => {
        const status = getStatus(borrowing);
        return status.toLowerCase() === statusFilter.toLowerCase();
      });
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(borrowing => 
        borrowing.student_name?.toLowerCase().includes(query) || 
        borrowing.book_name?.toLowerCase().includes(query)
      );
    }
    
    setFilteredBorrowings(filtered);
  };

  // Get status string from borrowing object
  const getStatus = (borrowing) => {
    if (borrowing.return_date) {
      return new Date(borrowing.return_date) > new Date(borrowing.due_date) ? 'Returned Late' : 'Returned';
    }
    return new Date() > new Date(borrowing.due_date) ? 'Overdue' : 'Borrowed';
  };

  // Helper function to format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    
    // Format as "Jan 15, 2025"
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Calculate status based on dates
  const calculateStatus = (borrowing) => {
    if (borrowing.return_date) {
      const returnDate = new Date(borrowing.return_date);
      const dueDate = new Date(borrowing.due_date);
      
      if (returnDate > dueDate) {
        return { 
          status: 'Returned Late', 
          className: 'overdue',
          badgeClass: 'status-badge returned-late' 
        };
      } else {
        return { 
          status: 'Returned', 
          className: 'returned',
          badgeClass: 'status-badge returned' 
        };
      }
    } else {
      const today = new Date();
      const dueDate = new Date(borrowing.due_date);
      
      if (today > dueDate) {
        const diffTime = Math.abs(today - dueDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return { 
          status: `Overdue`, 
          extraInfo: `${diffDays} ${diffDays === 1 ? 'day' : 'days'} late`,
          className: 'overdue',
          badgeClass: 'status-badge overdue' 
        };
      } else {
        const diffTime = Math.abs(dueDate - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return { 
          status: 'Borrowed', 
          extraInfo: `${diffDays} ${diffDays === 1 ? 'day' : 'days'} remaining`,
          className: '',
          badgeClass: 'status-badge borrowed' 
        };
      }
    }
  };

  // Get time elapsed since reservation
  const getTimeElapsed = (dateString) => {
    if (!dateString) return '';
    
    const reservationDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - reservationDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} ${Math.floor(diffDays / 7) === 1 ? 'week' : 'weeks'} ago`;
    
    return `${Math.floor(diffDays / 30)} ${Math.floor(diffDays / 30) === 1 ? 'month' : 'months'} ago`;
  };

  // Calculate fine amount display
  const calculateFineDisplay = (borrowing) => {
    if (borrowing.fine_amount > 0) {
      return `Rs. ${borrowing.fine_amount}`;
    }
    
    // If no fine_amount but returned late
    if (borrowing.return_date && new Date(borrowing.return_date) > new Date(borrowing.due_date)) {
      return 'Waived';
    }
    
    return '-';
  };

  if (loading) {
    return <div className="loading">Loading borrowings data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="borrowing-container">
      <h2>Borrowing Records</h2>
      
      {/* Search and Filter Bar */}
      <div className="controls-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by student or book name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>
              ×
            </button>
          )}
        </div>
        
        <div className="status-filter">
          <label htmlFor="status-select">Status:</label>
          <select 
            id="status-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="borrowed">Borrowed</option>
            <option value="overdue">Overdue</option>
            <option value="returned">Returned</option>
            <option value="returned late">Returned Late</option>
          </select>
        </div>
        
        {(searchQuery || statusFilter !== 'all') && (
          <button className="clear-filters" onClick={() => {
            setSearchQuery('');
            setStatusFilter('all');
          }}>
            Clear Filters
          </button>
        )}
      </div>
      
      {/* Results Summary */}
      <div className="results-summary">
        {filteredBorrowings.length === 0 ? (
          <p>No borrowings found matching your criteria</p>
        ) : (
          <p>Showing {filteredBorrowings.length} {filteredBorrowings.length === 1 ? 'borrowing record' : 'borrowing records'}</p>
        )}
      </div>
      
      <table className="borrowing-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Book</th>
            <th>Reserved Date</th>
            <th>Borrow Date</th>
            <th>Due Date</th>
            <th>Return Date</th>
            <th>Fine</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredBorrowings.length > 0 ? (
            filteredBorrowings.map((borrowing) => {
              // Skip entries without borrow_date (pending status) for admin view
              if (!borrowing.borrow_date) return null;
              
              const { status, extraInfo, className, badgeClass } = calculateStatus(borrowing);
              
              return (
                <tr key={borrowing._id} className={className}>
                  <td>{borrowing.student_name}</td>
                  <td>{borrowing.book_name}</td>
                  <td>
                    {formatDate(borrowing.reservation_date)}
                    {borrowing.reservation_date && (
                      <div className="date-elapsed">
                        {getTimeElapsed(borrowing.reservation_date)}
                      </div>
                    )}
                  </td>
                  <td>{formatDate(borrowing.borrow_date)}</td>
                  <td>{formatDate(borrowing.due_date)}</td>
                  <td>{borrowing.return_date ? formatDate(borrowing.return_date) : 'Not returned'}</td>
                  <td>{calculateFineDisplay(borrowing)}</td>
                  <td>
                    <span className={badgeClass}>
                      {status}
                    </span>
                    {extraInfo && (
                      <div className="status-info">
                        {extraInfo}
                      </div>
                    )}
                  </td>
                </tr>
              );
            }).filter(Boolean) // Filter out null values (pending entries)
          ) : (
            <tr>
              <td colSpan="8" className="no-results">
                No borrowed books found matching your criteria.
                <span className="no-results-tip">
                  Try adjusting your filters or search terms
                </span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowingDetails;
