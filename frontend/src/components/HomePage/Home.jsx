import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <section className="hero">
        <h1>Welcome to Our Library 📚</h1>
        <p>Discover, Learn, and Grow with Thousands of Books</p>
        <div className="hero-buttons">
          <button className="btn primary" onClick={() => navigate("/books")}>
            Browse Books
          </button>
          <button className="btn secondary" onClick={() => navigate("/signup")}>
            Join Now
          </button>
        </div>
      </section>

      <section className="features">
        <h2>Why Choose Us?</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>📖 Huge Collection</h3>
            <p>Explore thousands of books across different genres.</p>
          </div>
          <div className="feature-card">
            <h3>🔍 Smart Search</h3>
            <p>Find books easily with our advanced search feature.</p>
          </div>
          <div className="feature-card">
            <h3>👨‍👩‍👧‍👦 Community</h3>
            <p>Join a passionate community of readers.</p>
          </div>
          <div className="feature-card">
            <h3>⚡ Fast & Easy</h3>
            <p>Borrow and return books quickly with no hassle.</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Start Your Reading Journey Today!</h2>
        <button className="btn primary" onClick={() => navigate("/signup")}>
          Get Started
        </button>
      </section>
    </div>
  );
};

export default Home;
