// import React, { useState } from "react";
// import { FaPencilAlt } from "react-icons/fa";
// import "./Profile.css";

// const Profile = () => {
//   const [profileImage, setProfileImage] = useState(null);
//   const [user, setUser] = useState({
//     studentId: "2329256",
//     name: "Sanjeev Kumar Sah",
//     email: "rauniyarsanjeev742@gmail.com",
//     contact: "9807872536",
//   });

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file && file.type.startsWith("image/")) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfileImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     } else {
//       alert("Please upload a valid image file.");
//     }
//   };

//   return (
//     <div className="profile-card">
//       <h1 className="profile-title">Profile</h1>
//       <div className="profile-image-container">
//         <div className="profile-image-wrapper">
//           <img
//             src={profileImage || "/path/to/default-image.jpg"}
//             alt="Profile"
//             className="profile-image"
//           />
//           <label className="profile-image-label" htmlFor="profile-image-input">
//             <FaPencilAlt className="profile-image-icon" />
//           </label>
//         </div>
//         <input
//           id="profile-image-input"
//           type="file"
//           accept="image/*"
//           onChange={handleImageChange}
//           className="profile-image-input"
//         />
//       </div>
//       <div className="profile-details">
//         <p><strong>Student ID:</strong> {user.studentId}</p>
//         <p><strong>Name:</strong> {user.name}</p>
//         <p><strong>Email:</strong> {user.email}</p>
//         <p><strong>Contact:</strong> {user.contact}</p>
//       </div>
//     </div>
//   );
// };

// export default Profile;


import React, { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import "./Profile.css";

const Profile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [user, setUser] = useState({
    _id: "",
    name: "",
    email: "",
    role: "",
    profileImage: "/path/to/default-image.jpg",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    _id: "",
    name: "",
    email: "",
    role: "",
    profileImage: "/path/to/default-image.jpg",
  });

  useEffect(() => {
    // Fetch user data from local storage or context
    const userData = JSON.parse(localStorage.getItem("user"));
    console.log("User Data from Local Storage:", userData); // Log the user data
    if (userData) {
      setUser(userData);
      setEditedUser(userData);
      setProfileImage(userData.profileImage);
      console.log("User ID:", userData._id); // Log the user ID
    }
  }, []);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const formData = new FormData();
      formData.append("profileImage", file);

      try {
        const response = await fetch(`http://localhost:3000/api/users/${user._id}/profile-image`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${user.token}`, // Include the authentication token
          },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Profile Image Upload Success:", data); // Log the success response
          setProfileImage(data.imagePath);
          setEditedUser((prevUser) => ({
            ...prevUser,
            profileImage: data.imagePath,
          }));
        } else {
          const errorData = await response.json();
          console.error("Profile Image Upload Error:", errorData); // Log the error response
          alert("Failed to upload profile image.");
        }
      } catch (err) {
        console.error("Error uploading profile image:", err);
      }
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`, // Include the authentication token
        },
        body: JSON.stringify(editedUser),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Profile Update Success:", data); // Log the success response
        setUser(editedUser);
        setIsEditing(false);
        localStorage.setItem("user", JSON.stringify(editedUser));
      } else {
        const errorData = await response.json();
        console.error("Profile Update Error:", errorData); // Log the error response
        alert("Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  return (
    <div className="profile-card">
      <h1 className="profile-title">Profile</h1>
      <div className="profile-image-container">
        <div className="profile-image-wrapper">
          <img
            src={profileImage}
            alt="Profile"
            className="profile-image"
            onError={(e) => {
              console.error("Image loading error:", e);
            }}
          />
          <label className="profile-image-label" htmlFor="profile-image-input">
            <FaPencilAlt className="profile-image-icon" />
          </label>
        </div>
        <input
          id="profile-image-input"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="profile-image-input"
        />
      </div>
      <div className="profile-details">
        {isEditing ? (
          <>
            <input
              type="text"
              name="name"
              value={editedUser.name}
              onChange={handleInputChange}
              className="profile-input"
            />
            <input
              type="email"
              name="email"
              value={editedUser.email}
              onChange={handleInputChange}
              className="profile-input"
            />
            <input
              type="text"
              name="role"
              value={editedUser.role}
              onChange={handleInputChange}
              className="profile-input"
              disabled
            />
            <button onClick={handleSave} className="profile-save-btn">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="profile-cancel-btn">
              Cancel
            </button>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <button onClick={() => setIsEditing(true)} className="profile-edit-btn">
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
