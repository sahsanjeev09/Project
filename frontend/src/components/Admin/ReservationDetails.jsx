// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './ReservationDetails.css';

// const ReservationDetails = () => {
//   const [reservations, setReservations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [statusFilter, setStatusFilter] = useState('all');

//   useEffect(() => {
//     const fetchReservations = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get('/api/reservations');
//         setReservations(response.data);
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching reservations:', err);
//         setError('Failed to load reservations. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReservations();
//   }, []);

//   const filteredReservations = statusFilter === 'all' 
//     ? reservations 
//     : reservations.filter(res => res.status === statusFilter);

//   const getStatusClass = (status) => {
//     switch(status) {
//       case 'approved': return 'status-approved';
//       case 'rejected': return 'status-rejected';
//       // case 'pending': return 'status-pending';
//       default: return '';
//     }
//   };

//   if (loading) return <div className="loading">Loading reservations...</div>;
//   if (error) return <div className="error">{error}</div>;

//   return (
//     <div className="reservation-details-container">
//       <h2>Reservation Details</h2>
      
//       <div className="filter-container">
//         <label htmlFor="status-filter">Filter by Status: </label>
//         <select 
//           id="status-filter" 
//           value={statusFilter} 
//           onChange={(e) => setStatusFilter(e.target.value)}
//         >
//           <option value="all">All Reservations</option>
//           {/* <option value="pending">Pending</option> */}
//           <option value="approved">Approved</option>
//           <option value="rejected">Rejected</option>
//         </select>
//       </div>

//       {filteredReservations.length > 0 ? (
//         <div className="table-container">
//           <table className="reservations-table">
//             <thead>
//               <tr>
//                 <th>Student Name</th>
//                 <th>Book Title</th>
//                 <th>Reservation Date</th>
//                 <th>Status</th>
//                 {/* <th>Actions</th> */}
//               </tr>
//             </thead>
//             <tbody>
//               {filteredReservations.map((reservation) => (
//                 <tr key={reservation._id}>
//                   <td>{reservation.student_name}</td>
//                   <td>{reservation.book_name}</td>
//                   <td>{new Date(reservation.reservation_date).toLocaleDateString()}</td>
//                   <td className={getStatusClass(reservation.status)}>
//                     {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="no-data">No reservations found</div>
//       )}
//     </div>
//   );
// };

// export default ReservationDetails; 

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../Librarian/SearchBar';
import FilterDropdown from '../Librarian/FilterDropdown';
import './ReservationDetails.css';

const ReservationDetails = () => {
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

  const filteredReservations = reservations.filter((res) => {
    const matchesStatus = statusFilter === 'all' || res.status === statusFilter;
    const matchesSearch =
      res.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.book_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusOptions = [
    { value: 'all', label: 'All Reservations' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  };

  return (
    <div className="reservation-details-container">
      <h2>Reservation Details</h2>

      <div className="controls">
        <SearchBar
          onSearch={setSearchTerm}
          placeholder="Search by student name or book title..."
        />
        <div className="filter-section">
          <h2>Filter by status:</h2>
          <FilterDropdown
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            options={statusOptions}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading reservations...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : filteredReservations.length > 0 ? (
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
              {filteredReservations.map((res) => (
                <tr key={res._id}>
                  <td>{res.student_name}</td>
                  <td>{res.book_name}</td>
                  <td>{new Date(res.reservation_date).toLocaleDateString()}</td>
                  <td className={getStatusClass(res.status)}>
                    {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
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

export default ReservationDetails;

