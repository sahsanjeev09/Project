import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from "./components/Student/Login";
import Signup from "./components/Student/Signup";
import "./App.css";

function AppRoutes() {

  return (
    <Routes>
      {/* Public pages */}
      <Route element={<Layout />}>
        <Route path="/login" element={user ? <Navigate to={`/${user.role}Dashboard`} /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to={`/${user.role}Dashboard`} /> : <Signup />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes