import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";


export default function AdminDashboard() {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  // Redirect to login page if the user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      setUserName(user.name.charAt(0).toUpperCase());
    }
  }, [user, navigate]);

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <div className="admin-user-initial">{userName || "A"}</div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="sidebar">
          <ul>
            {navigationItems.map((item) => (
              <li
                key={item.section}
                className={activeSection === item.section ? "active" : ""}
                onClick={() => handleSectionChange(item.section)}
              >
                <span className="icon">{item.icon}</span>
                <span className="text">{item.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
