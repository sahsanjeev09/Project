import React from 'react';
import './FilterSideBar.css';

const FilterSideBar = ({ 
  show, 
  onClose, 
  filters, 
  onFilterChange, 
  onClearFilters,
  categories = ['Big Data', 'AI/ML', 'Web Development', 'IOT', 'Game Development', 'Software Engineering']
}) => {
  if (!show) return null;

  const handleRatingSelect = (rating) => {
    onFilterChange('rating', rating);
  };

  const renderRatingOption = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'filled' : ''}`}> ★ </span>
      );
    }
    return stars;
  };

  return (
    <div className="filter-sidebar filter-dropdown-content">

      <div className="filter-header">
        <h3>Filter Books</h3>
        <button className="close-button" onClick={onClose}> × </button>
      </div>

      <div className="filter-options-container">

        <div className="filter-section">
          <h4>Genre</h4>

          <div className="filter-options filter-dropdown-options">
            <label className={`filter-option ${filters.categories === 'all' ? 'selected' : ''}`}>
              <input type="radio" name="categories" value="all" checked={filters.categories === 'all'} onChange={() => onFilterChange('categories', 'all')} />
              <span>All Categories</span>
            </label>
            
            {categories.map(categories => (
              <label key={categories} className={`filter-option ${filters.categories === categories ? 'selected' : ''}`}>
                <input type="radio" name="categories" value={categories} checked={filters.categories === categories} onChange={() => onFilterChange('categories', categories)}/>
                <span>{categories}</span>
              </label>
            ))}
          </div>

        </div>

        <div className="filter-section">

          <h4>Availability</h4>

          <div className="filter-options">
            <label className={`filter-option ${filters.availability === 'all' ? 'selected' : ''}`}>
              <input type="radio" name="availability" value="all" checked={filters.availability === 'all'} onChange={() => onFilterChange('availability', 'all')}/>
              <span>All Books</span>
            </label>
            
            <label className={`filter-option ${filters.availability === 'available' ? 'selected' : ''}`}>
              <input type="radio" name="availability" value="available" checked={filters.availability === 'available'} onChange={() => onFilterChange('availability', 'available')}/>
              <span>Available Now</span>
            </label>
          </div>

        </div>

        <div className="filter-section">
          <h4>Minimum Rating</h4>

          <div className="rating-options">
            <label className={`rating-option ${filters.rating === 0 ? 'selected' : ''}`} onClick={() => handleRatingSelect(0)}> Any </label>
            {[1, 2, 3, 4, 5].map(rating => (
              <label key={rating} className={`rating-option ${filters.rating === rating ? 'selected' : ''}`} onClick={() => handleRatingSelect(rating)}>

                <div className="star-rating">
                  {renderRatingOption(rating)}
                </div>

                <span className="rating-label">{rating}+</span>
              </label>
            ))}
          </div>

        </div>

      </div>

      <button className="clear-filters" onClick={onClearFilters}> Clear All Filters </button>
    </div>
  );
};
export default FilterSideBar; 