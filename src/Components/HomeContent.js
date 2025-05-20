import React from "react";
import './HomeContent.css';

function HomeContent() {
  return (
    <div className="home-content">
      <h1 className="home-title">Welcome to Library Management System</h1>
      <div className="book-grid">
        {/* Sample Book Cards */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="book-card">
            <img
              src={`https://via.placeholder.com/150?text=Book+${index + 1}`}
              alt={`Book ${index + 1}`}
            />
            <h2 className="book-card-title">Book Title {index + 1}</h2>
            <p className="book-card-author">Author Name</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomeContent;
