import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        {/* About Section */}
        <div className="footer-section">
          <h3>About Us</h3>
          <p>Providing access to knowledge and fostering a love for reading.</p>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/books">Books</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div className="footer-section">
          <h3>Services</h3>
          <ul>
            <li><Link to="/services/borrowing">Borrowing</Link></li>
            <li><Link to="/services/digital">Digital Library</Link></li>
            <li><Link to="/services/study-rooms">Study Rooms</Link></li>
            <li><Link to="/services/events">Events</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p><i className="fas fa-map-marker-alt"></i> 123 Library St, City</p>
          <p><i className="fas fa-phone"></i> +1 234 567 890</p>
          <p><i className="fas fa-envelope"></i> info@library.com</p>
          <p><i className="fas fa-clock"></i> Mon - Fri: 9 AM - 8 PM</p>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Library Management System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;