// import React from 'react';
// import './BookCard.css';

// const BookCard = ({ book, onClick }) => {
//   return (
//     <div className="book-card" onClick={() => onClick(book.id)}>
//       <div className="book-image-container">
//         <img src={book.image} alt={book.title} className="book-image" />
//         <div className={`availability-badge ${book.available > 0 ? 'available' : 'unavailable'}`}>
//           {book.available > 0 ? 'Available' : 'Unavailable'}
//         </div>
//       </div>
//       <div className="book-info">
//         <h2 className="book-title">{book.title}</h2>
//         <p className="book-author">{book.author}</p>
//         <div className="book-rating">
//           {/* Render stars based on rating */}
//           {[...Array(5)].map((_, index) => (
//             <span key={index} className={`star ${index < book.rating ? 'filled' : ''}`}>★</span>
//           ))}
//           <span className="review-count">({book.reviewCount})</span>
//         </div>
//         <p className="availability">
//           Available: {book.available} | Reserved: {book.reserved}
//         </p>
//         <button className="view-details-button">View Details</button>
//       </div>
//     </div>
//   );
// };

// export default BookCard;

//Perfectly working 

// import React from 'react';
// import './BookCard.css';

// const BookCard = ({ book, onClick }) => {
//   return (
//     <div className="book-card" onClick={() => onClick(book.id)}>
//       <div className="book-image-container">
//         <img src={book.image} alt={book.title} className="book-image" />
//         <div className={`availability-badge ${book.available > 0 ? 'available' : 'unavailable'}`}>
//           {book.available > 0 ? 'Available' : 'Unavailable'}
//         </div>
//       </div>
//       <div className="book-info">
//         <h2 className="book-title">{book.title}</h2>
//         <p className="book-author">{book.author}</p>
//         <div className="book-rating">
//           {/* Render stars based on rating */}
//           {[...Array(5)].map((_, index) => (
//             <span key={index} className={`star ${index < book.rating ? 'filled' : ''}`}>★</span>
//           ))}
//           <span className="review-count">({book.reviewCount})</span>
//         </div>
//         <p className="availability">
//           Available: {book.available} | Reserved: {book.reserved}
//         </p>
//         <button className="view-details-button">View Details</button>
//       </div>
//     </div>
//   );
// };

// export default BookCard;


//update gareko reserve count display garna ko lagi
import React from 'react';
import './BookCard.css';

const BookCard = ({ book, onClick }) => {
  const {
    id,
    title,
    author,
    image,
    rating,
    reviewCount,
    availableCount,
    reservedCount
  } = book;

  return (
    <div className="book-card" onClick={() => onClick(id)}>
      <div className="book-image-container">
        <img src={image} alt={title} className="book-image" />
        <div className={`availability-badge ${availableCount > 0 ? 'available' : 'unavailable'}`}>
          {availableCount > 0 ? 'Available' : 'Unavailable'}
        </div>
      </div>
      <div className="book-info">
        <h2 className="book-title">{title}</h2>
        <p className="book-author">{author}</p>
        <div className="book-rating">
          {/* Render stars based on rating */}
          {[...Array(5)].map((_, index) => (
            <span key={index} className={`star ${index < rating ? 'filled' : ''}`}>★</span>
          ))}
          <span className="review-count">({reviewCount})</span>
        </div>
        <p className="availability">
          Available: {availableCount} | Reserved: {reservedCount}
        </p>
        <button className="view-details-button">View Details</button>
      </div>
    </div>
  );
};

export default BookCard;
