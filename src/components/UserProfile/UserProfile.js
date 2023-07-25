import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserProfile.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(
    JSON.parse(localStorage.getItem("currentUser")).id
  );
  const [profilePicture, setProfilePicture] = useState(
    "https://cdn-icons-png.flaticon.com/512/2102/2102633.png"
  );

  // Fetch the user data from the backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `https://bug-tracker-av8h.onrender.com/users/${userId}`
        ); // Replace with your API endpoint to fetch user data
        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile-container">
      <div className="user-profile-card neobrutalist-border">
        <div className="profile-picture">
          <img src={profilePicture || user.profilePicture} alt="Profile" />
        </div>
        <div className="profile-details">
          <div className="detail-row"> {user.username}</div>
          <div className="detail-row">{user.email}</div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
