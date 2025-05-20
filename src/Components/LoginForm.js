import React from "react";
import './LoginForm.css';

function LoginForm({ onRegisterClick }) {
  return (
    <div className="container">
      <h2 className="title">Login</h2>
      <form>
        <label className="label">Username/Email</label>
        <input
          type="text"
          className="input"
          placeholder="Enter your username"
        />
        <label className="label">Password</label>
        <input
          type="password"
          className="input"
          placeholder="Enter your password"
        />
        <div className="checkbox-container">
          <label>
            <input type="checkbox" className="checkbox" /> Remember me
          </label>
        </div>
        <button type="submit" className="button">
          Login
        </button>
        <p className="footer-text">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onRegisterClick}
            className="footer-link"
          >
            Register
          </button>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
