import React from "react";
import './SignupForm.css';

function SignupForm({ onLoginClick }) {
  return (
    <div className="container">
      <h2 className="title">Sign Up</h2>
      <form>
        <label className="label">Full Name</label>
        <input
          type="text"
          className="input"
          placeholder="Enter your full name"
        />
        <label className="label">Email</label>
        <input
          type="email"
          className="input"
          placeholder="Enter your email"
        />
        <label className="label">Address</label>
        <input
          type="text"
          className="input"
          placeholder="Enter your address"
        />
        <label className="label">Contact Number</label>
        <input
          type="text"
          className="input"
          placeholder="Enter your contact number"
        />
        <label className="label">Password</label>
        <input
          type="password"
          className="input"
          placeholder="Enter your password"
        />
        <label className="label">Confirm Password</label>
        <input
          type="password"
          className="input"
          placeholder="Confirm your password"
        />
        <button type="submit" className="button">
          Register
        </button>
        <p className="footer-text">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onLoginClick}
            className="footer-link"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}

export default SignupForm;
