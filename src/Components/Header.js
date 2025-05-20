import React from "react";
import './Header.css';

function Header({ onLoginClick }) {
  return (
    <header className="header">
      <div className="header-title">
        📚 Library Management
      </div>
      <div className="header-search">
        <input
          type="text"
          placeholder="Search for books..."
        />
      </div>
      <div className="header-actions">
        <button onClick={onLoginClick}>
          Login
        </button>
        <div className="header-notifications">
          <span>🔔</span>
          <span>Notifications</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
