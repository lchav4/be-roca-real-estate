import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPen } from "react-icons/fa";
import "./Profile.css";

const Profile = ({ user }) => {
  const [isEditing, setIsEditing] = useState({
    email: false,
    name: false,
  });
  const [updatedUser, setUpdatedUser] = useState({
    email: user.email,
    name: user.username,
  });

  const handleEditClick = (field) => {
    setIsEditing((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (
      updatedUser.email === user.email &&
      updatedUser.name === user.username
    ) {
      toast.info("Ningún campo ha sido modificado.");
      return;
    }

    console.log("Enviando datos al backend:", updatedUser);
    console.log("Email actual:", user.email);

    try {
      const response = await fetch("/api/updateProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentEmail: user.email,
          newEmail: updatedUser.email,
          username: updatedUser.name,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Perfil actualizado correctamente!");
        setIsEditing({ email: false, name: false });
      } else {
        throw new Error(data.error || "Error al actualizar el perfil");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="profile-container">
      <ToastContainer />
      <div className="profile">
        <h1>Perfil</h1>

        <div className="profile-field">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={updatedUser.email}
            disabled={!isEditing.email}
            onChange={handleChange}
            className={isEditing.email ? "editable" : "disabled"}
          />
          <FaPen
            className="edit-icon"
            onClick={() => handleEditClick("email")}
          />
        </div>

        <div className="profile-field">
          <label>Nombre:</label>
          <input
            type="text"
            name="name"
            value={updatedUser.name}
            disabled={!isEditing.name}
            onChange={handleChange}
            className={isEditing.name ? "editable" : "disabled"}
          />
          <FaPen
            className="edit-icon"
            onClick={() => handleEditClick("name")}
          />
        </div>

        {(isEditing.email || isEditing.name) && (
          <button className="save-button" onClick={handleSave}>
            Actualizar Perfil
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
