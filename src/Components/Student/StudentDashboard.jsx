import React, { useEffect, useState } from "react";
import "./StudentDashboard.css"; // Import the CSS file for styling

const StudentDashboard = () => {
  const { user, logout } = useAuth(); // Using the auth context to manage user state
  const [activeSection, setActiveSection] = useState("profile");
  const navigate = useNavigate();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="admin-dashboard-container">
      {/* Header */}
      <div className="admin-header">
        <h2>Student Dashboard</h2>
        <div className="admin-user-initial">{user ? user.name.charAt(0).toUpperCase() : "S"}</div>
      </div>

      <div className="main-container">
        {/* Sidebar */}
        <div className="sidebar">
          <ul className="sidebar-nav">
            {navigationItems.map((item) => (
              <li
                key={item.section}
                className={`sidebar-item ${activeSection === item.section ? "active" : ""}`}
                onClick={() => {
                  if (item.section === "logout") {
                    handleLogout();
                  } else {
                    setActiveSection(item.section);
                  }
                }}
              >
                {item.icon}
                <span className="sidebar-text">{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
