import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ResetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {};
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validatePassword = (pwd) => {
    const passwordCriteria = /^(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=.*[0-9])(?=.*[a-z]).{8,}$/;
    setPasswordError(
      passwordCriteria.test(pwd) ? "" :
      "Password must be at least 8 characters, include 1 uppercase, 1 number, and 1 special character."
    );
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", { position: "top-center" });
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message, { position: "top-center" });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(data.message || "Password reset failed", { position: "top-center" });
      }
    } catch (err) {
      toast.error("An error occurred, please try again.", { position: "top-center" });
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h2>Reset Password</h2>
        <form onSubmit={handleResetPassword}>
          <div className="input-group">
            <label>OTP</label>
            <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>New Password</label>
            <input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => { setNewPassword(e.target.value); validatePassword(e.target.value); }} required />
            {passwordError && <p className="error-text">{passwordError}</p>}
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <button type="submit" className="reset-password-btn">Reset Password</button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ResetPassword;
