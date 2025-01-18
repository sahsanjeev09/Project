import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthContext";

import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [email, password]);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setError("Please fill in both fields.");
      toast.error("Please fill in both fields.", { position: "top-center" });
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const userData = {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          token: data.token,
        };
  
        login(userData);
  
        const isProduction = process.env.NODE_ENV === "production";
        document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}; ${
          isProduction ? "secure; samesite=strict" : ""
        }`;
  
        toast.success("Logged in successfully!", { position: "top-center" });
  
        setTimeout(() => {
          if (data.role === "admin") navigate("/adminDashboard");
          else if (data.role === "student") navigate("/studentDashboard");
          else if (data.role === "librarian") navigate("/librarianDashboard");
        }, 2000); // Delay navigation by 2 seconds to show the toast
      } else {
        if (data.message === "Incorrect password") {
          toast.error("Incorrect password", { position: "top-center" });
        } else if (data.message === "User does not exist") {
          toast.error("User does not exist", { position: "top-center" });
        } else if (data.message === "Account not approved") {
          toast.error("Account not approved, please wait for approval", { position: "top-center" });
        } else {
          toast.error("Login failed", { position: "top-center" });
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.", { position: "top-center" });
    }
  };
  

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="image-section">
          <img
            src="/aboutUsBanner.jpg"
            alt="Library"
          />
        </div>
        <div className="form-section">
          <div className="loginBox">
            <h1>Welcome Back</h1>
            <p className="login-subtext">Login to your account</p>
            <form onSubmit={handleLogin}>
              <div className="inputGroup">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="inputGroup passwordContainer">
                <label>Password</label>
                <div className="passwordWrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span className="eyeIcon" onClick={togglePasswordVisibility}>
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
                <div className="forgot-password">
                  <p>
                    <Link to="/forgot-password">
                      Forgot Password?
                    </Link>
                  </p>
                </div>
              </div>
              {error && <p className="errorText">{error}</p>}
              <button className="loginBtn">Login</button>
            </form>
            <div className="signupText">
              <span>
                Don’t have an account? <Link to="/signup">Register</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
