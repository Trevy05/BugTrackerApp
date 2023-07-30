import React from "react";
import "./User.css";

const User = ({ name, email, avatar, bio, handleInvite, userInfo }) => {
  return (
    <div className="user-card animate__animated animate__fadeIn">
      <div className="user-avatar">
        <img src={avatar} alt="User Avatar" />
      </div>
      <div className="user-details">
        <h2>{name}</h2>
        <p>{email}</p>
        <p>{bio}</p>
      </div>
      <button onClick={() => handleInvite(userInfo)}>Invite</button>
    </div>
  );
};

export default User;
