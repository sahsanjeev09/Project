// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./OtpVerification.css";

// const OtpVerification = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { userId } = location.state || {};
//   const [otp, setOtp] = useState("");

//   const handleVerifyOTP = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("http://localhost:3000/api/auth/verify-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId, otp }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         toast.success(data.message, { position: "top-center" });
//         setTimeout(() => navigate("/login"), 2000);
//       } else {
//         toast.error(data.message || "OTP verification failed", { position: "top-center" });
//       }
//     } catch (err) {
//       toast.error("An error occurred, please try again.", { position: "top-center" });
//     }
//   };

//   return (
//     <div className="otp-container">
//       <div className="otp-box">
//         <h2>OTP Verification</h2>
//         <form onSubmit={handleVerifyOTP}>
//           <div className="input-group">
//             <label>Enter OTP</label>
//             <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
//           </div>
//           <button type="submit" className="otp-btn">Verify OTP</button>
//         </form>
//         <ToastContainer />
//       </div>
//     </div>
//   );
// };

// export default OtpVerification;


import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./OtpVerification.css";

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {};
  const [otp, setOtp] = useState("");

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message, { position: "top-center" });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(data.message || "OTP verification failed", { position: "top-center" });
      }
    } catch (err) {
      toast.error("An error occurred, please try again.", { position: "top-center" });
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-box">
        <h2>OTP Verification</h2>
        <form onSubmit={handleVerifyOTP}>
          <div className="input-group">
            <label>Enter OTP</label>
            <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
          </div>
          <button type="submit" className="otp-btn">Verify OTP</button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default OtpVerification;
