import React from "react";
import "./Profile.css"; 

const Profile = ({ user }) => {
  if (!user) {
    return <div className="loading">Loading...</div>; 
  }

  return (
    <div className="profile">
      <h1>{user.username}</h1> 
      <p><span>Email:</span> {user.email}</p>
      <p><span>Nombre:</span> {user.username}</p>
    </div>
  );
};

export default Profile;
