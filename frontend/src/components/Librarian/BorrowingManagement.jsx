// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import SearchBar from '../Librarian/SearchBar';
// import FilterDropdown from '../Librarian/FilterDropdown';
// import './BorrowingManagement.css';

// const BorrowingManagement = () => {
//   const [reservations, setReservations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [filteredReservations, setFilteredReservations] = useState([]);

//   const statusOptions = [
//     { value: 'all', label: 'All' },
//     { value: 'pending', label: 'Pending' },
//     { value: 'borrowed', label: 'Borrowed' },
//     { value: 'returned', label: 'Returned' },
//     { value: 'overdue', label: 'Overdue' },
//     { value: 'returned late', label: 'Returned Late' },
//   ];

//   useEffect(() => {
//     fetchReservations();
//   }, []);

//   useEffect(() => {
//     applyFilters();
//   }, [reservations, searchTerm, statusFilter]);

//   const fetchReservations = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get('http://localhost:3000/api/borrowings/approved-reservations');
//       setReservations(response.data);
//       setFilteredReservations(response.data);
//       setLoading(false);
//     } catch (err) {
//       console.error('Error fetching reservations:', err);
//       setError('Failed to load reservations.');
//       setLoading(false);
//     }
//   };

//   const applyFilters = () => {
//     let filtered = reservations;
//     if (statusFilter !== 'all') {
//       filtered = filtered.filter(reservation => reservation.status === statusFilter);
//     }
//     if (searchTerm.trim()) {
//       const query = searchTerm.toLowerCase();
//       filtered = filtered.filter(reservation =>
//         reservation.student_name.toLowerCase().includes(query) ||
//         reservation.book_name.toLowerCase().includes(query)
//       );
//     }
//     setFilteredReservations(filtered);
//   };

//   const handleBorrow = async (id) => {
//     console.log('Borrowing ID:', id); // Log the borrowing ID
//     try {
//       await axios.post('http://localhost:3000/api/borrowings/', { reservation_id: id });
//       fetchReservations();
//     } catch (err) {
//       console.error('Error borrowing:', err);
//     }
//   };

//   const handleReturn = async (id) => {
//     const today = new Date();
//     const reservation = reservations.find(r => r._id === id);
//     if (!reservation) return;

//     const dueDate = new Date(reservation.due_date);
//     const isLate = today > dueDate;

//     const updateData = {
//       return_date: today,
//       status: isLate ? 'returned late' : 'returned',
//       fine_amount: isLate ? calculateFine(today, dueDate) : 0,
//     };

//     try {
//       await axios.put(`http://localhost:3000/api/borrowings/return/${id}`, updateData);
//       fetchReservations();
//     } catch (err) {
//       console.error('Error returning:', err);
//     }
//   };

//   const calculateFine = (returnDate, dueDate) => {
//     const diffTime = returnDate - dueDate;
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays * 15; // Rs.15 per day
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div className="borrowing-management">
//       <h1>Borrowing Management</h1>

//       <div className="controls">
//         <SearchBar onSearch={setSearchTerm} placeholder="Search by student or book..." />
//         <div className="filter-section">
//           <h2>Filter by status:</h2>
//           <FilterDropdown statusFilter={statusFilter} setStatusFilter={setStatusFilter} options={statusOptions} />
//         </div>
//       </div>

//       <table className="borrowings-table">
//         <thead>
//           <tr>
//             <th>Student Name</th>
//             <th>Book Name</th>
//             <th>Reservation Date</th>
//             <th>Borrow Date</th>
//             <th>Due Date</th>
//             <th>Return Date</th>
//             <th>Fine</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredReservations.map((reservation) => (
//             <tr key={reservation._id}>
//               <td>{reservation.student_name}</td>
//               <td>{reservation.book_name}</td>
//               <td>{formatDate(reservation.reservation_date)}</td>
//               <td>{formatDate(reservation.borrow_date)}</td>
//               <td>{formatDate(reservation.due_date)}</td>
//               <td>{formatDate(reservation.return_date)}</td>
//               <td>Rs. {reservation.fine_amount || 0}</td>
//               <td>{reservation.status}</td>
//               <td>
//                 {reservation.status === 'pending' && (
//                   <button onClick={() => handleBorrow(reservation._id)}>Borrow</button>
//                 )}
//                 {(reservation.status === 'borrowed' || reservation.status === 'overdue') && (
//                   <button onClick={() => handleReturn(reservation._id)}>Return</button>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default BorrowingManagement;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../Librarian/SearchBar';
import FilterDropdown from '../Librarian/FilterDropdown';
import './BorrowingManagement.css';

const BorrowingManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredReservations, setFilteredReservations] = useState([]);

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'borrowed', label: 'Borrowed' },
    { value: 'returned', label: 'Returned' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'returned late', label: 'Returned Late' },
  ];

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reservations, searchTerm, statusFilter]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/borrowings/approved-reservations');
      setReservations(response.data);
      setFilteredReservations(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('Failed to load reservations.');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = reservations;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(reservation => reservation.status === statusFilter);
    }
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(reservation =>
        reservation.student_name.toLowerCase().includes(query) ||
        reservation.book_name.toLowerCase().includes(query)
      );
    }
    setFilteredReservations(filtered);
  };

  // const handleBorrow = async (id) => {
  //   console.log('Borrowing ID:', id); // Log the borrowing ID
  //   try {
  //     await axios.post('http://localhost:3000/api/borrowings/', { reservation_id: id });
  //     fetchReservations();
  //   } catch (err) {
  //     console.error('Error borrowing:', err);
  //   }
  // };

  const handleBorrow = async (id) => {
    console.log('Borrowing ID:', id); // Log the borrowing ID
    try {
      await axios.post('http://localhost:3000/api/borrowings/', { reservation_id: id });
      fetchReservations();
    } catch (err) {
      console.error('Error borrowing:', err);
    }
  };  

  const handleReturn = async (id) => {
    const today = new Date();
    const reservation = reservations.find(r => r._id === id);
    if (!reservation) return;

    const dueDate = new Date(reservation.due_date);
    const isLate = today > dueDate;

    const updateData = {
      return_date: today,
      status: isLate ? 'returned late' : 'returned',
      fine_amount: isLate ? calculateFine(today, dueDate) : 0,
    };

    try {
      await axios.put(`http://localhost:3000/api/borrowings/return/${id}`, updateData);
      fetchReservations();
    } catch (err) {
      console.error('Error returning:', err);
    }
  };

  const calculateFine = (returnDate, dueDate) => {
    const diffTime = returnDate - dueDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * 15; // Rs.15 per day
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="borrowing-management">
      <h1>Borrowing Management</h1>

      <div className="controls">
        <SearchBar onSearch={setSearchTerm} placeholder="Search by student or book..." />
        <div className="filter-section">
          <h2>Filter by status:</h2>
          <FilterDropdown statusFilter={statusFilter} setStatusFilter={setStatusFilter} options={statusOptions} />
        </div>
      </div>

      <table className="borrowings-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Student Email</th>
            <th>Book Name</th>
            <th>Reservation Date</th>
            <th>Borrow Date</th>
            <th>Due Date</th>
            <th>Return Date</th>
            <th>Fine</th>
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
              <td>{formatDate(reservation.reservation_date)}</td>
              <td>{formatDate(reservation.borrow_date)}</td>
              <td>{formatDate(reservation.due_date)}</td>
              <td>{formatDate(reservation.return_date)}</td>
              <td>Rs. {reservation.fine_amount || 0}</td>
              <td>{reservation.status}</td>
              <td>
                {reservation.status === 'pending' && (
                  <button onClick={() => handleBorrow(reservation._id)}>Borrow</button>
                )}
                {(reservation.status === 'borrowed' || reservation.status === 'overdue') && (
                  <button onClick={() => handleReturn(reservation._id)}>Return</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowingManagement;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import SearchBar from '../Librarian/SearchBar';
// import FilterDropdown from '../Librarian/FilterDropdown';
// import './BorrowingManagement.css';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const BorrowingManagement = () => {
//   const [borrowings, setBorrowings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [filteredBorrowings, setFilteredBorrowings] = useState([]);

//   const statusOptions = [
//     { value: 'all', label: 'All' },
//     { value: 'pending', label: 'Pending' },
//     { value: 'borrowed', label: 'Borrowed' },
//     { value: 'returned', label: 'Returned' },
//     { value: 'overdue', label: 'Overdue' },
//     { value: 'returned late', label: 'Returned Late' },
//   ];

//   useEffect(() => {
//     fetchBorrowings();
//   }, []);

//   useEffect(() => {
//     applyFilters();
//   }, [borrowings, searchTerm, statusFilter]);

//   const fetchBorrowings = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get('http://localhost:3000/api/borrowings/approved-reservations');
//       setBorrowings(response.data);
//       setFilteredBorrowings(response.data);
//       setLoading(false);
//     } catch (err) {
//       console.error('Error fetching reservations:', err);
//       setError('Failed to load reservations.');
//       setLoading(false);
//     }
//   };

//   const applyFilters = () => {
//     let filtered = borrowings;
//     if (statusFilter !== 'all') {
//       filtered = filtered.filter(borrowing => borrowing.status === statusFilter);
//     }
//     if (searchTerm.trim()) {
//       const query = searchTerm.toLowerCase();
//       filtered = filtered.filter(borrowing =>
//         borrowing.student_name.toLowerCase().includes(query) ||
//         borrowing.book_name.toLowerCase().includes(query)
//       );
//     }
//     setFilteredBorrowings(filtered);
//   };

//   const handleBorrow = async (id) => {
//     console.log('Borrowing ID:', id); // Log the borrowing ID
//     try {
//       await axios.post('http://localhost:3000/api/borrowings/', { reservation_id: id });
//       fetchBorrowings();
//       toast.success('Book borrowed successfully!');
//     } catch (err) {
//       console.error('Error borrowing:', err);
//       toast.error('Failed to borrow book.');
//     }
//   };

//   const handleReturn = async (id) => {
//     const today = new Date();
//     const borrowing = borrowings.find(b => b._id === id);
//     if (!borrowing) return;

//     const dueDate = new Date(borrowing.due_date);
//     const isLate = today > dueDate;

//     const updateData = {
//       return_date: today,
//       status: isLate ? 'returned late' : 'returned',
//       fine_amount: isLate ? calculateFine(today, dueDate) : 0,
//     };

//     try {
//       await axios.put(`http://localhost:3000/api/borrowings/return/${id}`, updateData);
//       fetchBorrowings();
//       toast.success('Book returned successfully!');
//     } catch (err) {
//       console.error('Error returning:', err);
//       toast.error('Failed to return book.');
//     }
//   };

//   const calculateFine = (returnDate, dueDate) => {
//     const diffTime = returnDate - dueDate;
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays * 15; // Rs.15 per day
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div className="borrowing-management">
//       <ToastContainer />
//       <h1>Borrowing Management</h1>

//       <div className="controls">
//         <SearchBar onSearch={setSearchTerm} placeholder="Search by student or book..." />
//         <div className="filter-section">
//           <h2>Filter by status:</h2>
//           <FilterDropdown statusFilter={statusFilter} setStatusFilter={setStatusFilter} options={statusOptions} />
//         </div>
//       </div>

//       <table className="borrowings-table">
//         <thead>
//           <tr>
//             <th>Student Name</th>
//             <th>Student Email</th>
//             <th>Book Name</th>
//             <th>Reservation Date</th>
//             <th>Borrow Date</th>
//             <th>Due Date</th>
//             <th>Return Date</th>
//             <th>Fine</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredBorrowings.map((borrowing) => (
//             <tr key={borrowing._id}>
//               <td>{borrowing.student_name}</td>
//               <td>{borrowing.student_email}</td>
//               <td>{borrowing.book_name}</td>
//               <td>{formatDate(borrowing.reservation_date)}</td>
//               <td>{formatDate(borrowing.borrow_date)}</td>
//               <td>{formatDate(borrowing.due_date)}</td>
//               <td>{formatDate(borrowing.return_date)}</td>
//               <td>Rs. {borrowing.fine_amount || 0}</td>
//               <td>{borrowing.status}</td>
//               <td>
//                 {borrowing.status === 'pending' && (
//                   <button onClick={() => handleBorrow(borrowing._id)}>Borrow</button>
//                 )}
//                 {(borrowing.status === 'borrowed' || borrowing.status === 'overdue') && (
//                   <button onClick={() => handleReturn(borrowing._id)}>Return</button>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default BorrowingManagement;
