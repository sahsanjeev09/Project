import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../Librarian/SearchBar'; // Import the existing SearchBar component
import FilterDropdown from '../Librarian/FilterDropdown'; // Import the existing FilterDropdown component
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ReservationManagement.css';

const ReservationManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/reservations');
        setReservations(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching reservations:', err);
        setError('Failed to load reservations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`/api/reservations/${id}`, { status: newStatus });
      // Update the local state
      setReservations(prev =>
        prev.map(res => res._id === id ? { ...res, status: newStatus } : res)
      );
      toast.success(`Reservation status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating reservation status:', err);
      toast.error('Failed to update reservation status');
    }
  };

  const filteredReservations = reservations
    .filter(res => res.status === statusFilter || statusFilter === 'all')
    .filter(res =>
      res.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.book_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const statusOptions = [
    { value: 'all', label: 'All Reservations' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const getStatusClass = (status) => {
    switch(status) {
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      case 'pending': return 'status-pending';
      default: return '';
    }
  };

  if (loading) return <div className="loading">Loading reservations...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="reservation-details-container">
      <ToastContainer /> {/* Add ToastContainer here */}
      <h2>Reservation Management</h2>

      <div className="controls">
        <SearchBar
          onSearch={setSearchTerm}
          placeholder="Search by student name or book title..."
        />
        <div className="filter-section">
          <h2>Filter by status:</h2>
          <FilterDropdown statusFilter={statusFilter} setStatusFilter={setStatusFilter} options={statusOptions} />
        </div>
      </div>

      {filteredReservations.length > 0 ? (
        <div className="table-container">
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Student Email</th>
                <th>Book Title</th>
                <th>Reservation Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((reservation) => (
                <tr key={reservation._id}>
                  <td>{reservation.student_name}</td>
                  <td>{reservation.student_email}</td>
                  <td>{reservation.book_name}</td>
                  <td>{new Date(reservation.reservation_date).toLocaleDateString()}</td>
                  <td className={getStatusClass(reservation.status)}>
                    {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                  </td>
                  <td>
                    <select
                      value={reservation.status}
                      onChange={(e) => handleStatusChange(reservation._id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approve</option>
                      <option value="rejected">Reject</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-data">No reservations found</div>
      )}
    </div>
  );
};

export default ReservationManagement;
