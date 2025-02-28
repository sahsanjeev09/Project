import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message, { position: "top-center" });
        setTimeout(() => navigate("/otp-verification", { state: { email } }), 2000);
      } else {
        toast.error(data.message || "Failed to send OTP", { position: "top-center" });
      }
    } catch (err) {
      toast.error("An error occurred, please try again.", { position: "top-center" });
    }
  };

  return (
    <div className="loginContainer">
      <div className="forgot-password">
        <h2>Forgot Password</h2>
        <form onSubmit={handleForgotPassword}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button type="submit" className="forgot-password-btn">Send OTP</button>
        </form>
        <ToastContainer />
      </div>
    </div>
    // <div className="forgot-password-container">
    //   <div className="forgot-password-box">
    //     <h2>Forgot Password</h2>
    //     <form onSubmit={handleForgotPassword}>
    //       <div className="input-group">
    //         <label>Email</label>
    //         <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
    //       </div>
    //       <button type="submit" className="forgot-password-btn">Send OTP</button>
    //     </form>
    //     <ToastContainer />
    //   </div>
    // </div>
  );
};

export default ForgotPassword;