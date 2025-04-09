// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import SearchBar from '../Librarian/SearchBar';
// import FilterDropdown from '../Librarian/FilterDropdown';
// import './Fine.css';

// const Fine = () => {
//   const [fines, setFines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [filteredFines, setFilteredFines] = useState([]);

//   const statusOptions = [
//     { value: 'all', label: 'All Status' },
//     { value: 'unpaid', label: 'Unpaid' },
//     { value: 'paid', label: 'Paid' }
//   ];

//   // Fetch all fines on component mount
//   useEffect(() => {
//     fetchFines();
//   }, []);

//   // Apply filters when data or filters change
//   useEffect(() => {
//     applyFilters();
//   }, [fines, searchQuery, statusFilter]);

//   // Fetch fines data
//   const fetchFines = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const studentName = localStorage.getItem('studentName'); // Assuming student name is stored in localStorage
//       const response = await axios.get(`http://localhost:3000/api/fines/student/${studentName}`, {
//         withCredentials: true,
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.data) {
//         throw new Error('No data received from server');
//       }

//       setFines(response.data);
//       setFilteredFines(response.data);
//     } catch (err) {
//       console.error('Error fetching fines:', err);
//       setError(
//         err.response?.data?.message ||
//         'Failed to load fines. Please try again later.'
//       );
//       setFines([]);
//       setFilteredFines([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Apply filters to fines
//   const applyFilters = () => {
//     let filtered = [...fines];

//     // Apply status filter if not already filtered by API
//     if (statusFilter !== 'all' && statusFilter !== 'unpaid') {
//       filtered = filtered.filter(fine => fine.payment_status === statusFilter);
//     }

//     // Apply search filter
//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase();
//       filtered = filtered.filter(fine =>
//         (fine.student_name && fine.student_name.toLowerCase().includes(query)) ||
//         (fine.book_name && fine.book_name.toLowerCase().includes(query))
//       );
//     }

//     setFilteredFines(filtered);
//   };

//   // Format date for display
//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   if (loading) {
//     return <div className="loading">Loading fines data...</div>;
//   }

//   if (error) {
//     return <div className="error">{error}</div>;
//   }

//   return (
//     <div className="fine-management">
//       <h1>My Fines</h1>

//       <div className="controls-bar">
//         <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
//         <div className="filter-section">
//           <h2>Filter by status:</h2>
//           <FilterDropdown statusFilter={statusFilter} setStatusFilter={setStatusFilter} options={statusOptions} />
//         </div>
//       </div>

//       {error && <div className="error-message">{error}</div>}

//       <div className="table-container">
//         <table>
//           <thead>
//             <tr>
//               <th>Book</th>
//               <th>Due Date</th>
//               <th>Return Date</th>
//               <th>Fine Amount (Rs.)</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredFines.map((fine) => (
//               <tr key={fine._id} className={fine.payment_status === 'unpaid' ? 'unpaid' : 'paid'}>
//                 <td>{fine.book_name || '-'}</td>
//                 <td>{formatDate(fine.due_date) || '-'}</td>
//                 <td>{formatDate(fine.return_date) || '-'}</td>
//                 <td>{fine.amount || 0}</td>
//                 <td>
//                   <span className={`status-badge ${fine.payment_status}`}>
//                     {fine.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Fine;
