import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

  const validatePassword = (pwd) => {
    const passwordCriteria = /^(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=.*[0-9])(?=.*[a-z]).{8,}$/;
    setPasswordError(
      passwordCriteria.test(pwd) ? "" :
      "Password must be at least 8 characters, include 1 uppercase, 1 number, and 1 special character."
    );
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    validatePassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMatchError(e.target.value !== password ? "Passwords do not matched" : "");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not matched", { position: "top-center" });
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role, password }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message, { position: "top-center" });

        // Navigate to OTP verification page with userId
        const userId = data.userId; // Assuming the backend returns the userId
        navigate("/otp-verification", { state: { userId } });
      } else {
        toast.error(data.message || "Signup failed", { position: "top-center" });
      }
    } catch (err) {
      toast.error("An error occurred, please try again.", { position: "top-center" });
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
            <h1>Welcome to our Library</h1>
            <p className="login-subtext">Register your new account</p>
            <form onSubmit={handleSignup}>
              <div className="inputGroup">
                <label>Full Name</label>
                <input type="text" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="inputGroup">
                <label>Email</label>
                <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="inputGroup">
                <label>Select Role</label>
                <div className="role-select-wrapper">
                  <select value={role} onChange={(e) => setRole(e.target.value)} className="role-select">
                    <option value="admin">Admin</option>
                    <option value="librarian">Librarian</option>
                    <option value="student">Student</option>
                  </select>
                  <span className="role-icon"><FaUser /></span>
                </div>
              </div>
              <div className="inputGroup passwordContainer">
                <label>Password</label>
                <div className="passwordWrapper">
                  <input type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={handlePasswordChange} required />
                  <span className="eyeIcon" onClick={togglePasswordVisibility}>{showPassword ? <FaEye /> : <FaEyeSlash />}</span>
                </div>
                {passwordError && <p className="errorText">{passwordError}</p>}
              </div>
              <div className="inputGroup passwordContainer">
                <label>Confirm Password</label>
                <div className="passwordWrapper">
                  <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" value={confirmPassword} onChange={handleConfirmPasswordChange} required />
                  <span className="eyeIcon" onClick={toggleConfirmPasswordVisibility}>{showConfirmPassword ? <FaEye /> : <FaEyeSlash />}</span>
                </div>
                {passwordMatchError && <p className="errorText">{passwordMatchError}</p>}
              </div>
              <button type="submit" className="authBtn">Signup</button>
              <p className="switchAuth">Already have an account? <Link to="/login">Login</Link></p>
            </form>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

