import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyReservation.css';

const MyReservation = () => {
  const [reservations, setReservations] = useState([]);
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
    const fetchReservations = async () => {
      if (!token) {
        setError('User not logged in.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get('/api/reservations/student', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
  }, [token]);

  const filteredReservations = statusFilter === 'all'
    ? reservations
    : reservations.filter(res => res.status === statusFilter);

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
      <h2>My Reservations</h2>

      {filteredReservations.length > 0 ? (
        <div className="table-container">
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Book Title</th>
                <th>Reservation Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((reservation) => (
                <tr key={reservation._id}>
                  <td>{reservation.student_name}</td>
                  <td>{reservation.book_name}</td>
                  <td>{new Date(reservation.reservation_date).toLocaleDateString()}</td>
                  <td className={getStatusClass(reservation.status)}>
                    {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
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

export default MyReservation;
