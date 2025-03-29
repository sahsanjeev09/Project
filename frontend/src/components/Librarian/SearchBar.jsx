// import React from 'react';
// import './SearchBar.css';

// const SearchBar = ({ searchQuery, setSearchQuery }) => {
//   return (
//     <div className="search-bar">
//       <input
//         type="text"
//         placeholder="Search by student or book name..."
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//       />
//       <span className="search-icon">
//         <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//           <path d="M14.6666 14.6666L10.6666 10.6666M12 6.66665C12 9.61265 9.61265 12 6.66665 12C3.72065 12 1.33331 9.61265 1.33331 6.66665C1.33331 3.72065 3.72065 1.33331 6.66665 1.33331C9.61265 1.33331 12 3.72065 12 6.66665Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//         </svg>
//       </span>
//       {searchQuery && (
//         <button className="clear-search" onClick={() => setSearchQuery('')}>
//           ×
//         </button>
//       )}
//     </div>
//   );
// };

// export default SearchBar;


import React from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";

const SearchBar = ({ placeholder = "Search...", onSearch }) => {
  const handleChange = (e) => {
    const query = e.target.value;
    onSearch(query);
  };

  return (
    <form className="search-form" onSubmit={(e) => e.preventDefault()}>
      <input
        type="search"
        name="search"
        className="search-input"
        placeholder={placeholder}
        onChange={handleChange}
      />
      <button type="submit" className="search-icon-button" aria-label="Search">
        <FaSearch />
      </button>
    </form>
  );
};

export default SearchBar;
