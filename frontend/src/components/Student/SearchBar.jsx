import React, { useState, useRef, useEffect } from 'react';
import './SearchBar.css';

const SearchBar = ({ searchTerm, onSearch, onFilterToggle, books = [] }) => {
  const [inputValue, setInputValue] = useState(searchTerm);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focused, setFocused] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    // Handle clicks outside the suggestions box
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) && 
        inputRef.current && 
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.trim().length >= 2) {
      // Generate suggestions from titles, authors, and genres
      const titleMatches = books
        .filter(book => book.title.toLowerCase().includes(value.toLowerCase()))
        .map(book => ({ type: 'title', value: book.title, id: book.id }));
      
      const authorMatches = books
        .filter(book => book.author.toLowerCase().includes(value.toLowerCase()))
        .map(book => ({ type: 'author', value: book.author, id: book.id }));
      
      // Extract unique genres from matching books
      const categoriesMatches = [...new Set(
        books
          .filter(book => book.categories.toLowerCase().includes(value.toLowerCase()))
          .map(book => book.categories)
      )].map(categories => ({ type: 'genre', value: categories }));
      
      // Combine results, prioritize exact matches and remove duplicates
      const allSuggestions = [
        ...titleMatches.slice(0, 3),
        ...authorMatches
          .filter(author => !titleMatches.some(title => title.id === author.id))
          .slice(0, 3),
        ...categoriesMatches.slice(0, 2)
      ].slice(0, 6);
      
      setSuggestions(allSuggestions);
      setShowSuggestions(allSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    
    onSearch(value);
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'title' || suggestion.type === 'author') {
      setInputValue(suggestion.value);
      onSearch(suggestion.value);
    } else if (suggestion.type === 'genre') {
      // For genre suggestions, search by genre
      setInputValue(suggestion.value);
      onSearch(suggestion.value);
    }
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setInputValue('');
    onSearch('');
    inputRef.current.focus();
  };

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
    onFilterToggle();
  };

  return (
    <div className="search-bar">
      
      <div className={`search-input-wrapper ${focused ? 'focused' : ''}`}>
        <span className="search-icon">🔍</span>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search by title, author or genre..."
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            setFocused(true);
            if (inputValue.trim().length >= 2) {
              setShowSuggestions(suggestions.length > 0);
            }
          }}
          onBlur={() => setFocused(false)}
        />
        {inputValue && (
          <button className="clear-search" onClick={handleClearSearch} aria-label="Clear search"> × </button>
        )}
      </div>
      
      {showSuggestions && (

        <div className="search-suggestions" ref={suggestionsRef}>
          {suggestions.map((suggestion, index) => (

            <div key={index}  className="suggestion-item" onClick={() => handleSuggestionClick(suggestion)} >

              <span className="suggestion-icon">
                {suggestion.type === 'title' ? '📕' : suggestion.type === 'author' ? '👤' : '🏷️'}
              </span>

              <div className="suggestion-content">
                <span className="suggestion-text">{suggestion.value}</span>
                <span className="suggestion-type">{suggestion.type}</span>
              </div>

            </div>
          ))}
        </div>
      )}
      
      <button className={`filter-toggle ${isFilterOpen ? 'active' : ''}`} onClick={handleFilterToggle} aria-label="Toggle filters" aria-expanded={isFilterOpen}>
        <span className="filter-icon">📊</span>
        <span>Filters</span>
        <span className="dropdown-arrow">{isFilterOpen ? '▲' : '▼'}</span>
      </button>
      
    </div>
  );
};

export default SearchBar; 