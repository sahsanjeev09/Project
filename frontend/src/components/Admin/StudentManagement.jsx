// import React, { useState, useEffect } from "react";
// import "./StudentManagement.css";

// const StudentManagement = () => {
//   const [students, setStudents] = useState([]);
//   const [updatedStatus, setUpdatedStatus] = useState("");

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/api/students', {
//           credentials: 'include',
//         });
//         const data = await response.json();
//         setStudents(data);
//       } catch (error) {
//         console.error("Error fetching students data:", error);
//       }
//     };

//     fetchStudents();
//   }, []);

//   const updateStudentStatus = async (_id, status) => {
//     try {
//       const response = await fetch('http://localhost:3000/api/students/update-status', {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ studentID: _id, status }),
//       });

//       if (response.ok) {
//         setUpdatedStatus("Status updated successfully");
//         // Refresh the student list after updating the status
//         const updatedStudents = students.map(student =>
//           student._id === _id ? { ...student, status } : student
//         );
//         setStudents(updatedStudents);
//       } else {
//         setUpdatedStatus("Failed to update status");
//       }
//     } catch (error) {
//       console.error("Error updating status:", error);
//       setUpdatedStatus("Error updating status");
//     }
//   };

//   return (
//     <div className="student-details">
//       <h1>Students Registration Management</h1>
//       {updatedStatus && <p className="status-message">{updatedStatus}</p>}
//       <table>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {students.map((student) => (
//             <tr key={student._id}>
//               <td>{student.name}</td>
//               <td>{student.email}</td>
//               <td>{student.status}</td>
//               <td>
//                 <button onClick={() => updateStudentStatus(student._id, 'active')}>
//                   Verify
//                 </button>
//                 <button onClick={() => updateStudentStatus(student._id, 'rejected')}>
//                   Reject
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default StudentManagement;

// import React, { useState, useEffect } from "react";
// import "./StudentManagement.css";

// const StudentManagement = () => {
//   const [students, setStudents] = useState([]);
//   const [updatedStatus, setUpdatedStatus] = useState("");

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/api/students', {
//           credentials: 'include',
//         });
//         const data = await response.json();
//         setStudents(data);
//       } catch (error) {
//         console.error("Error fetching students data:", error);
//       }
//     };

//     fetchStudents();
//   }, []);

//   const updateStudentStatus = async (_id, status) => {
//     try {
//       const response = await fetch(`http://localhost:3000/api/auth/approve/${_id}`, {
//         method: 'PUT',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ status }),
//       });

//       if (response.ok) {
//         setUpdatedStatus("Status updated successfully");
//         // Refresh the student list after updating the status
//         const updatedStudents = students.map(student =>
//           student._id === _id ? { ...student, status } : student
//         );
//         setStudents(updatedStudents);
//       } else {
//         setUpdatedStatus("Failed to update status");
//       }
//     } catch (error) {
//       console.error("Error updating status:", error);
//       setUpdatedStatus("Error updating status");
//     }
//   };

//   return (
//     <div className="student-details">
//       <h1>Students Registration Management</h1>
//       {updatedStatus && <p className="status-message">{updatedStatus}</p>}
//       <table>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {students.map((student) => (
//             <tr key={student._id}>
//               <td>{student.name}</td>
//               <td>{student.email}</td>
//               <td>{student.status}</td>
//               <td>
//                 <button onClick={() => updateStudentStatus(student._id, 'active')}>
//                   Verify
//                 </button>
//                 <button onClick={() => updateStudentStatus(student._id, 'rejected')}>
//                   Reject
//                 </button>
//                 <button onClick={() => updateStudentStatus(student._id, 'blocked')}>
//                   Block
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default StudentManagement;

import React, { useState, useEffect } from "react";
import SearchBar from "../Librarian/SearchBar";
import FilterDropdown from "../Librarian/FilterDropdown";
import "./StudentManagement.css";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/students", {
          credentials: "include",
        });
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students data:", error);
      }
    };

    fetchStudents();
  }, []);

  const updateStudentStatus = async (_id, status) => {
    try {
      const response = await fetch(`http://localhost:3000/api/auth/approve/${_id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setUpdatedStatus("Status updated successfully");
        const updatedStudents = students.map((student) =>
          student._id === _id ? { ...student, status } : student
        );
        setStudents(updatedStudents);
      } else {
        setUpdatedStatus("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setUpdatedStatus("Error updating status");
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || student.status === filter;
    return matchesSearch && matchesFilter;
  });

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "rejected", label: "Rejected" },
    { value: "blocked", label: "Blocked" },
  ];

  return (
    <div className="student-details-container">
      <h1>Students Registration Management</h1>
      {updatedStatus && <p className="status-message">{updatedStatus}</p>}

      <div className="controls">
        <SearchBar
          onSearch={setSearchTerm}
          placeholder="Search by name or email..."
        />
        <div className="filter-section">
          <h2>Filter by status:</h2>
          <FilterDropdown
            statusFilter={filter}
            setStatusFilter={setFilter}
            options={statusOptions}
          />
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="no-results">
          <p>No students found matching your search or filters.</p>
        </div>
      ) : (
        <table className="student-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.status}</td>
                <td>
                  <button onClick={() => updateStudentStatus(student._id, "active")}>
                    Verify
                  </button>
                  <button onClick={() => updateStudentStatus(student._id, "rejected")}>
                    Reject
                  </button>
                  <button onClick={() => updateStudentStatus(student._id, "blocked")}>
                    Block
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentManagement;
