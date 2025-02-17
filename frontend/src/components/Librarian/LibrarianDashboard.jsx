import React, { useState, useEffect } from "react";
import "./LibrarianDashboard.css";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("book catalog");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.name) {
        setUserName(userData.name.charAt(0).toUpperCase());
      }
    }
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Librarian Dashboard</h2>
        <div className="admin-user-initial">{userName || "L"}</div>
      </div>

      <div className="flex flex-1">
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

        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
