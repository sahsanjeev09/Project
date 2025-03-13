// import React from 'react';

// const Pagination = ({ currentPage, totalPages, onPageChange }) => {
//   const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

//   return (
//     <div className="pagination">
//       {pages.map(page => (
//         <button
//           key={page}
//           className={page === currentPage ? 'active' : ''}
//           onClick={() => onPageChange(page)}
//         >
//           {page}
//         </button>
//       ))}
//     </div>
//   );
// };

// export default Pagination;


// src/components/Pagination.jsx
import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="pagination-container">
      <button
        className="pagination-arrow"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FaChevronLeft />
      </button>

      {getPageNumbers().map((item, index) =>
        item === '...' ? (
          <span key={index} className="pagination-dots">...</span>
        ) : (
          <button
            key={index}
            className={`pagination-button ${item === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(item)}
          >
            {item}
          </button>
        )
      )}

      <button
        className="pagination-arrow"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
