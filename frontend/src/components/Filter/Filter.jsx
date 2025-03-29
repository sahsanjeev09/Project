import React, { useState } from 'react';
import './Filter.css';

const Filter = ({ onFilter }) => {
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState('');

  // Sample data for dropdowns; replace with actual data as needed
  const filterOptions = {
    genres: ['Fiction', 'Non-fiction', 'Science Fiction', 'Fantasy', 'Mystery'],
    authors: ['J.K. Rowling', 'George Orwell', 'Agatha Christie', 'Stephen King'],
    categories: ['Adventure', 'Romance', 'Historical', 'Educational'],
  };

  const handleFilter = () => {
    if (filterType && filterValue) {
      onFilter({ [filterType]: filterValue });
    }
  };

  return (
    <div className="filter-container">
      <h3>Filter By</h3>
      <label>
        Filter Type:
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">Select Filter Type</option>
          <option value="genre">Genre</option>
          <option value="author">Author</option>
          <option value="category">Category</option>
        </select>
      </label>
      {filterType && filterOptions[filterType + 's'] && (
        <label>
          {filterType.charAt(0).toUpperCase() + filterType.slice(1)}:
          <select value={filterValue} onChange={(e) => setFilterValue(e.target.value)}>
            <option value="">Select {filterType}</option>
            {filterOptions[filterType + 's'].map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      )}
      <button onClick={handleFilter} className="filter-button">
        Apply Filter
      </button>
    </div>
  );
};

export default Filter;
