// import React, { useState, useEffect } from 'react';
// import { FaArrowLeft } from 'react-icons/fa';
// import axios from 'axios';
// import './DetailsPage.css';

// // Configure axios defaults
// axios.defaults.baseURL = 'http://localhost:3000';
// axios.defaults.withCredentials = true;

// const DetailsPage = ({ bookId, setSelectedBookId }) => {
//   const [book, setBook] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [reserving, setReserving] = useState(false);

//   useEffect(() => {
//     const fetchBook = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(`/api/books/${bookId}`);
//         setBook(res.data);
//         setError('');
//       } catch (err) {
//         console.error('Error fetching book details:', err);
//         setError(err.response?.data?.message || 'Error loading book details. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (bookId) {
//       fetchBook();
//     }
//   }, [bookId]);

//   const handleReserve = async () => {
//     const user = JSON.parse(localStorage.getItem('user'));
//     console.log('User object:', user);
    
//     if (!user || user.role !== 'student') {
//       alert('Only students can reserve books.');
//       return;
//     }
    
//     // Extract user ID from token
//     let userId = null;
//     if (user.token) {
//       try {
//         // Get the payload part of the JWT token
//         const payload = user.token.split('.')[1];
//         // Decode the base64 string
//         const decodedPayload = JSON.parse(atob(payload));
//         userId = decodedPayload.id;
//         console.log('Extracted user ID:', userId);
//       } catch (err) {
//         console.error('Error extracting user ID from token:', err);
//       }
//     }
    
//     if (!userId) {
//       alert('Could not identify user. Please log in again.');
//       return;
//     }
  
//     try {
//       setReserving(true);
//       const res = await axios.post('/api/reservations', {
//         book_id: book._id,
//         book_name: book.Book_Name,
//         student_name: user.name,
//         student_id: userId
//       });
//       alert(res.data.message);
//       // Refresh book details to update availability
//       const updatedBook = await axios.get(`/api/books/${bookId}`);
//       setBook(updatedBook.data);
//     } catch (err) {
//       console.error('Reserve error:', err);
//       console.error('Error response:', err.response?.data);
//       alert(err.response?.data?.message || 'Failed to reserve book. Please try again.');
//     } finally {
//       setReserving(false);
//     }
//   };
  
//   const handleWishlist = async () => {
//     const user = JSON.parse(localStorage.getItem('user'));
//     if (!user || user.role !== 'student') {
//       alert('Only students can add to wishlist.');
//       return;
//     }
  
//     try {
//       const res = await axios.post('/api/wishlist', {
//         book_id: book._id,
//         book_name: book.Book_Name,
//         student_name: user.name
//       });
//       alert(res.data.message);
//     } catch (err) {
//       console.error('Wishlist error:', err);
//       alert(err.response?.data?.message || 'Failed to add to wishlist.');
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div className="error">{error}</div>;
//   if (!book) return <div>Book not found</div>;

//   const isAvailable = book.Available_count > 0;

//   return (
//     <div className="details-container">
//       <div className="details-header">
//         <button onClick={() => setSelectedBookId(null)} className="back-button">
//           <FaArrowLeft />
//         </button>
//       </div>

//       <div className="details-content">
//         <div className="book-details-left">
//           <img
//             src={`http://localhost:3000${book.Image}`}
//             alt={book.Book_Name}
//             className="book-details-image"
//             onError={(e) => e.target.src = 'https://via.placeholder.com/300?text=No+Image'}
//           />
//           <div className="action-row">
//             <div className="availability-text">
//               {isAvailable ? `Available: ${book.Available_count}` : 'Unavailable'}
//             </div>
//             <button
//               className={`action-button ${isAvailable ? 'reserve' : ''}`}
//               onClick={isAvailable ? handleReserve : handleWishlist}
//               disabled={reserving}
//             >
//               {reserving ? 'Reserving...' : isAvailable ? 'Reserve' : 'Wishlist'}
//             </button>
//           </div>
//         </div>

//         <div className="book-details-info">
//           <h1 className="book-details-title">{book.Book_Name}</h1>
//           <p className="book-details-author">by {book.Author}</p>

//           <ul className="book-info-list">
//             <li className="book-info-item">
//               <span className="book-info-label">ISBN:</span>
//               <span className="book-info-value">{book.ISBN || 'N/A'}</span>
//             </li>
//             <li className="book-info-item">
//               <span className="book-info-label">Category:</span>
//               <span className="book-info-value">{book.Category || 'N/A'}</span>
//             </li>
//             <li className="book-info-item">
//               <span className="book-info-label">Publisher:</span>
//               <span className="book-info-value">{book.Publisher}</span>
//             </li>
//             <li className="book-info-item">
//               <span className="book-info-label">Published Date:</span>
//               <span className="book-info-value">{book.PublishedDate}</span>
//             </li>
//             <li className="book-info-item">
//               <span className="book-info-label">Location:</span>
//               <span className="book-info-value">{book.Book_Location}</span>
//             </li>
//           </ul>

//           <h3 className="description-heading">Description:</h3>
//           <p className="book-details-description">{book.Description}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DetailsPage;


// import React, { useState, useEffect } from 'react';
// import { FaArrowLeft } from 'react-icons/fa';
// import axios from 'axios';
// import './DetailsPage.css';

// // Configure axios defaults
// axios.defaults.baseURL = 'http://localhost:3000';
// axios.defaults.withCredentials = true;

// const DetailsPage = ({ bookId, setSelectedBookId }) => {
//   const [book, setBook] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [reserving, setReserving] = useState(false);

//   useEffect(() => {
//     const fetchBook = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(`/api/books/${bookId}`);
//         setBook(res.data);
//         setError('');
//       } catch (err) {
//         console.error('Error fetching book details:', err);
//         setError(err.response?.data?.message || 'Error loading book details. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (bookId) {
//       fetchBook();
//     }
//   }, [bookId]);

//   const handleReserve = async () => {
//     const user = JSON.parse(localStorage.getItem('user'));
//     console.log('User object:', user);

//     if (!user || user.role !== 'student') {
//       alert('Only students can reserve books.');
//       return;
//     }

//     // Extract user ID from token
//     let userId = null;
//     if (user.token) {
//       try {
//         // Get the payload part of the JWT token
//         const payload = user.token.split('.')[1];
//         // Decode the base64 string
//         const decodedPayload = JSON.parse(atob(payload));
//         userId = decodedPayload.id;
//         console.log('Extracted user ID:', userId);
//       } catch (err) {
//         console.error('Error extracting user ID from token:', err);
//       }
//     }

//     if (!userId) {
//       alert('Could not identify user. Please log in again.');
//       return;
//     }

//     try {
//       setReserving(true);
//       const res = await axios.post('/api/reservations', {
//         book_id: book._id,
//         book_name: book.Book_Name,
//         student_name: user.name,
//         student_email: user.email,
//         student_id: userId
//       });
//       alert(res.data.message);
//       // Refresh book details to update availability
//       const updatedBook = await axios.get(`/api/books/${bookId}`);
//       setBook(updatedBook.data);
//     } catch (err) {
//       console.error('Reserve error:', err);
//       console.error('Error response:', err.response?.data);
//       alert(err.response?.data?.message || 'Failed to reserve book. Please try again.');
//     } finally {
//       setReserving(false);
//     }
//   };

//   const handleWishlist = async () => {
//     const user = JSON.parse(localStorage.getItem('user'));
//     if (!user || user.role !== 'student') {
//       alert('Only students can add to wishlist.');
//       return;
//     }

//     try {
//       const res = await axios.post('/api/wishlist', {
//         book_id: book._id,
//         book_name: book.Book_Name,
//         student_name: user.name,
//         student_email: user.email
//       });
//       alert(res.data.message);
//     } catch (err) {
//       console.error('Wishlist error:', err);
//       alert(err.response?.data?.message || 'Failed to add to wishlist.');
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div className="error">{error}</div>;
//   if (!book) return <div>Book not found</div>;

//   const isAvailable = book.Available_count > 0;

//   return (
//     <div className="details-container">
//       <div className="details-header">
//         <button onClick={() => setSelectedBookId(null)} className="back-button">
//           <FaArrowLeft />
//         </button>
//       </div>

//       <div className="details-content">
//         <div className="book-details-left">
//           <img
//             src={`http://localhost:3000${book.Image}`}
//             alt={book.Book_Name}
//             className="book-details-image"
//             onError={(e) => e.target.src = 'https://via.placeholder.com/300?text=No+Image'}
//           />
//           <div className="action-row">
//             <div className="availability-text">
//               {isAvailable ? `Available: ${book.Available_count}` : 'Unavailable'}
//             </div>
//             <button
//               className={`action-button ${isAvailable ? 'reserve' : ''}`}
//               onClick={isAvailable ? handleReserve : handleWishlist}
//               disabled={reserving}
//             >
//               {reserving ? 'Reserving...' : isAvailable ? 'Reserve' : 'Wishlist'}
//             </button>
//           </div>
//         </div>

//         <div className="book-details-info">
//           <h1 className="book-details-title">{book.Book_Name}</h1>
//           <p className="book-details-author">by {book.Author}</p>

//           <ul className="book-info-list">
//             <li className="book-info-item">
//               <span className="book-info-label">ISBN:</span>
//               <span className="book-info-value">{book.ISBN || 'N/A'}</span>
//             </li>
//             <li className="book-info-item">
//               <span className="book-info-label">Category:</span>
//               <span className="book-info-value">{book.Category || 'N/A'}</span>
//             </li>
//             <li className="book-info-item">
//               <span className="book-info-label">Publisher:</span>
//               <span className="book-info-value">{book.Publisher}</span>
//             </li>
//             <li className="book-info-item">
//               <span className="book-info-label">Published Date:</span>
//               <span className="book-info-value">{book.PublishedDate}</span>
//             </li>
//             <li className="book-info-item">
//               <span className="book-info-label">Location:</span>
//               <span className="book-info-value">{book.Book_Location}</span>
//             </li>
//           </ul>

//           <h3 className="description-heading">Description:</h3>
//           <p className="book-details-description">{book.Description}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DetailsPage;


// import React, { useState, useEffect } from 'react';
// import { FaStar } from 'react-icons/fa';
// import axios from 'axios';
// import Reviews from './Reviews';
// import './DetailsPage.css';

// // Configure axios defaults
// axios.defaults.baseURL = 'http://localhost:3000';
// axios.defaults.withCredentials = true;

// const DetailsPage = ({ bookId, setSelectedBookId }) => {
//   const [book, setBook] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [reserving, setReserving] = useState(false);
//   const [showFullDescription, setShowFullDescription] = useState(false);

//   useEffect(() => {
//     const fetchBook = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(`/api/books/${bookId}`);
//         setBook(res.data);
//         setError('');
//       } catch (err) {
//         console.error('Error fetching book details:', err);
//         setError(err.response?.data?.message || 'Error loading book details. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (bookId) {
//       fetchBook();
//     }
//   }, [bookId]);

//   const handleReserve = async () => {
//     const user = JSON.parse(localStorage.getItem('user'));
//     console.log('User object:', user);

//     if (!user || user.role !== 'student') {
//       alert('Only students can reserve books.');
//       return;
//     }

//     // Extract user ID from token
//     let userId = null;
//     if (user.token) {
//       try {
//         // Get the payload part of the JWT token
//         const payload = user.token.split('.')[1];
//         // Decode the base64 string
//         const decodedPayload = JSON.parse(atob(payload));
//         userId = decodedPayload.id;
//         console.log('Extracted user ID:', userId);
//       } catch (err) {
//         console.error('Error extracting user ID from token:', err);
//       }
//     }

//     if (!userId) {
//       alert('Could not identify user. Please log in again.');
//       return;
//     }

//     try {
//       setReserving(true);
//       const res = await axios.post('/api/reservations', {
//         book_id: book._id,
//         book_name: book.Book_Name,
//         student_name: user.name,
//         student_email: user.email,
//         student_id: userId
//       });
//       alert(res.data.message);
//       // Refresh book details to update availability
//       const updatedBook = await axios.get(`/api/books/${bookId}`);
//       setBook(updatedBook.data);
//     } catch (err) {
//       console.error('Reserve error:', err);
//       console.error('Error response:', err.response?.data);
//       alert(err.response?.data?.message || 'Failed to reserve book. Please try again.');
//     } finally {
//       setReserving(false);
//     }
//   };

//   const handleWishlist = async () => {
//     const user = JSON.parse(localStorage.getItem('user'));
//     if (!user || user.role !== 'student') {
//       alert('Only students can add to wishlist.');
//       return;
//     }

//     try {
//       const res = await axios.post('/api/wishlist', {
//         book_id: book._id,
//         student_name: user.name,
//         student_email: user.email,
//         book_name: book.Book_Name
//       });
//       alert(res.data.message);
//     } catch (err) {
//       console.error('Wishlist error:', err);
//       alert(err.response?.data?.message || 'Failed to add to wishlist.');
//     }
//   };

//   const scrollToReviews = () => {
//     const reviewsSection = document.getElementById('reviews-section');
//     if (reviewsSection) {
//       reviewsSection.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   const toggleDescription = () => {
//     setShowFullDescription(!showFullDescription);
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div className="error">{error}</div>;
//   if (!book) return <div>Book not found</div>;

//   const isAvailable = book.Available_count > 0;

//   return (
//     <div className="details-container">
//       <div className="details-header">
//         <button onClick={() => setSelectedBookId(null)} className="back-button">
//           Back
//         </button>
//       </div>

//       <div className="details-content">
//         <div className="book-details-left">
//           <img
//             src={`http://localhost:3000${book.Image}`}
//             alt={book.Book_Name}
//             className="book-details-image"
//             onError={(e) => e.target.src = 'https://via.placeholder.com/300?text=No+Image'}
//           />
//           <div className="action-row">
//             <div className="availability-text">
//               {isAvailable ? `Available: ${book.Available_count}` : 'Unavailable'}
//             </div>
//             <button
//               className={`action-button ${isAvailable ? 'reserve' : ''}`}
//               onClick={isAvailable ? handleReserve : handleWishlist}
//               disabled={reserving}
//             >
//               {reserving ? 'Reserving...' : isAvailable ? 'Reserve' : 'Wishlist'}
//             </button>
//           </div>
//         </div>

//         <div className="book-details-info">
//           <h1 className="book-details-title">{book.Book_Name}</h1>
//           <p className="book-details-author">by {book.Author}</p>

//           <div className="rating-summary" onClick={scrollToReviews}>
//             <span className="average-rating">4.6</span>
//             <div className="stars">
//               <FaStar className="full-star" />
//               <FaStar className="full-star" />
//               <FaStar className="full-star" />
//               <FaStar className="full-star" />
//               <FaStar className="half-star" />
//             </div>
//             <span className="rating-count">1,492 Ratings & 181 Reviews</span>
//           </div>

//           <ul className="book-info-list">
//             <li className="book-info-item">
//               <span className="book-info-label">ISBN:</span>
//               <span className="book-info-value">{book.ISBN || 'N/A'}</span>
//             </li>
//             <li className="book-info-item">
//               <span className="book-info-label">Category:</span>
//               <span className="book-info-value">{book.Category || 'N/A'}</span>
//             </li>
//             <li className="book-info-item">
//               <span className="book-info-label">Publisher:</span>
//               <span className="book-info-value">{book.Publisher}</span>
//             </li>
//             <li className="book-info-item">
//               <span className="book-info-label">Published Date:</span>
//               <span className="book-info-value">{book.PublishedDate}</span>
//             </li>
//             <li className="book-info-item">
//               <span className="book-info-label">Location:</span>
//               <span className="book-info-value">{book.Book_Location}</span>
//             </li>
//           </ul>

//           <h3 className="description-heading">Description:</h3>
//           <p className="book-details-description">
//             {showFullDescription ? book.Description : `${book.Description.substring(0, 300)}...`}
//             {book.Description.length > 300 && (
//               <button onClick={toggleDescription} className="read-more-button">
//                 {showFullDescription ? 'Show Less' : 'Read More'}
//               </button>
//             )}
//           </p>

//           <div id="reviews-section">
//             <Reviews />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DetailsPage;


import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';
import Reviews from './Reviews';
import './DetailsPage.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

const DetailsPage = ({ bookId, setSelectedBookId }) => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reserving, setReserving] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/books/${bookId}`);
        setBook(res.data);
        setError('');
      } catch (err) {
        console.error('Error fetching book details:', err);
        setError(err.response?.data?.message || 'Error loading book details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  const handleReserve = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'student') {
      toast.error('Only students can reserve books.');
      return;
    }

    // Extract user ID from token
    let userId = null;
    if (user.token) {
      try {
        const payload = user.token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));
        userId = decodedPayload.id;
      } catch (err) {
        console.error('Error extracting user ID from token:', err);
      }
    }

    if (!userId) {
      toast.error('Could not identify user. Please log in again.');
      return;
    }

    try {
      setReserving(true);
      const res = await axios.post('/api/reservations', {
        book_id: book._id,
        book_name: book.Book_Name,
        student_name: user.name,
        student_email: user.email,
        student_id: userId
      });
      toast.success(res.data.message); // Display success toast
      // Refresh book details to update availability
      const updatedBook = await axios.get(`/api/books/${bookId}`);
      setBook(updatedBook.data);
    } catch (err) {
      console.error('Reserve error:', err);
      // Display backend error message as a toast
      toast.error(err.response?.data?.message || 'Failed to reserve book. Please try again.');
    } finally {
      setReserving(false);
    }
  };

  const handleWishlist = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'student') {
      toast.error('Only students can add to wishlist.');
      return;
    }

    try {
      const res = await axios.post('/api/wishlist', {
        book_id: book._id,
        student_name: user.name,
        student_email: user.email,
        book_name: book.Book_Name
      });
      toast.success(res.data.message); // Display success toast
    } catch (err) {
      console.error('Wishlist error:', err);
      toast.error(err.response?.data?.message || 'Failed to add to wishlist.');
    }
  };

  const scrollToReviews = () => {
    const reviewsSection = document.getElementById('reviews-section');
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!book) return <div>Book not found</div>;

  const isAvailable = book.Available_count > 0;

  return (
    <div className="details-container">
      <ToastContainer /> {/* Add ToastContainer here */}
      <div className="details-header">
        <button onClick={() => setSelectedBookId(null)} className="back-button">
          Back
        </button>
      </div>

      <div className="details-content">
        <div className="book-details-left">
          <img
            src={`http://localhost:3000${book.Image}`}
            alt={book.Book_Name}
            className="book-details-image"
            onError={(e) => e.target.src = 'https://via.placeholder.com/300?text=No+Image'}
          />
          <div className="action-row">
            <div className="availability-text">
              {isAvailable ? `Available: ${book.Available_count}` : 'Unavailable'}
            </div>
            <button
              className={`action-button ${isAvailable ? 'reserve' : ''}`}
              onClick={isAvailable ? handleReserve : handleWishlist}
              disabled={reserving}
            >
              {reserving ? 'Reserving...' : isAvailable ? 'Reserve' : 'Wishlist'}
            </button>
          </div>
        </div>

        <div className="book-details-info">
          <h1 className="book-details-title">{book.Book_Name}</h1>
          <p className="book-details-author">by {book.Author}</p>

          <div className="rating-summary" onClick={scrollToReviews}>
            {/* <span className="average-rating">4.6</span> */}
            <span className="average-rating">{book.average_rating?.toFixed(1) || '0.0'}</span>
            {/* <div className="stars">
              <FaStar className="full-star" />
              <FaStar className="full-star" />
              <FaStar className="full-star" />
              <FaStar className="full-star" />
              <FaStar className="half-star" />
            </div> */}
             <div className="stars">
            {Array.from({ length: 5 }, (_, i) => (
              <FaStar
                key={i}
                className={i < Math.floor(book.average_rating || 0) ? 'full-star' : 'empty-star'}
              />
            ))}
          </div>
            {/* <span className="rating-count">1,492 Ratings & 181 Reviews</span> */}
            <span className="rating-count">
            {book.review_count || 0} {book.review_count === 1 ? 'Rating & Review' : 'Ratings & Reviews'}
          </span>
          </div>

          <ul className="book-info-list">
            <li className="book-info-item">
              <span className="book-info-label">ISBN:</span>
              <span className="book-info-value">{book.ISBN || 'N/A'}</span>
            </li>
            <li className="book-info-item">
              <span className="book-info-label">Category:</span>
              <span className="book-info-value">{book.Category || 'N/A'}</span>
            </li>
            <li className="book-info-item">
              <span className="book-info-label">Publisher:</span>
              <span className="book-info-value">{book.Publisher}</span>
            </li>
            <li className="book-info-item">
              <span className="book-info-label">Published Date:</span>
              <span className="book-info-value">{book.PublishedDate}</span>
            </li>
            <li className="book-info-item">
              <span className="book-info-label">Location:</span>
              <span className="book-info-value">{book.Book_Location}</span>
            </li>
          </ul>

          <h3 className="description-heading">Description:</h3>
          <p className="book-details-description">
            {showFullDescription ? book.Description : `${book.Description.substring(0, 300)}...`}
            {book.Description.length > 300 && (
              <button onClick={toggleDescription} className="read-more-button">
                {showFullDescription ? 'Show Less' : 'Read More'}
              </button>
            )}
          </p>

          <div id="reviews-section">
            <Reviews bookId={book._id} book={book} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
