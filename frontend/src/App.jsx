import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';


import Header from "./components/HomePage/Header";
import Home from "./components/HomePage/Home";
import About from "./components/HomePage/About";
import Footer from "./components/HomePage/Footer";
import Login from "./components/Student/Login";
import Signup from "./components/Student/Signup";
import OtpVerification from "./components/Student/OTPVerification";
import ForgotPassword from "./components/Student/ForgotPassword";
import ResetPassword from "./components/Student/ResetPassword";
import AdminDashboard from "./components/Admin/AdminDashboard";
import LibrarianDashboard from "./components/Librarian/LibrarianDashboard";
import StudentDashboard from "./components/Student/StudentDashboard";
import Book from "./components/Admin/Book";
import ReservationDetails from "./components/Admin/ReservationDetails";
import WishlistDetails from "./components/Admin/WishlistDetails";
import StudentManagement from "./components/Admin/StudentManagement";
import BorrowingDetails from "./components/Admin/BorrowingDetails";
import FineDetails from "./components/Admin/FineDetails";
import StudentDetails from "./components/Librarian/StudentDetails";
import ReservationManagement from "./components/Librarian/ReservationManagement";
import BorrowingManagement from "./components/Librarian/BorrowingManagement";
import FineManagement from "./components/Librarian/FineManagement";
import Profile from "./components/Profile";
// import Fine from "./components/Student/Fine";

import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";

// Layout with header & footer
const Layout = () => (
  <div className="app-container">
    <Header />
    <main className="content">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// Protected Route Wrapper
const ProtectedRoute = ({ role, children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  return user.role === role ? children : <Navigate to={`/${user.role}Dashboard`} />;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public pages */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={user ? <Navigate to={`/${user.role}Dashboard`} /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to={`/${user.role}Dashboard`} /> : <Signup />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Admin Dashboard */}
      <Route
        path="/adminDashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        <Route path="profile" element={<Profile/>}/>
        <Route path="add-book" element={<Book />} />
        <Route path="student-management" element={<StudentManagement />} />
        <Route path="reservation-details" element={<ReservationDetails />} />
        <Route path="wishlist-details" element={<WishlistDetails />} />
        <Route path="borrowing-details" element={<BorrowingDetails />} />
        <Route path="fine-details" element={<FineDetails />} />
      </Route>

      {/* Student Dashboard */}
      <Route
        path="/studentDashboard"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      >
        {/* <Route path="fine" element={<Fine />} /> */}
      </Route>

      {/* Librarian Dashboard */}
      <Route
        path="/librarianDashboard"
        element={
          <ProtectedRoute role="librarian">
            <LibrarianDashboard />
          </ProtectedRoute>
        }
      >
        <Route path="student-details" element={<StudentDetails />} />
        <Route path="reservation-management" element={<ReservationManagement />} />
        <Route path="borrowing-management" element={<BorrowingManagement />} />
        <Route path="wishlist-details" element={<WishlistDetails />} />
        <Route path="fine-management" element={<FineManagement />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to={user ? `/${user.role}Dashboard` : "/login"} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
