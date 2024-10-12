import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPen } from "react-icons/fa";
import { useLanguage } from '../app/LanguageContext';
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

  const { language } = useLanguage();

  const texts = {
    es: {
      profile: 'Perfil',
      email: 'Correo electrónico:',
      name: 'Nombre:',
      updateSuccess: 'Perfil actualizado correctamente!',
      noChanges: 'Ningún campo ha sido modificado.',
      updateProfile: 'Actualizar Perfil',
      errorUpdate: 'Error al actualizar el perfil',
    },
    en: {
      profile: 'Profile',
      email: 'Email:',
      name: 'Name:',
      updateSuccess: 'Profile updated successfully!',
      noChanges: 'No fields have been modified.',
      updateProfile: 'Update Profile',
      errorUpdate: 'Error updating profile',
    },
  };

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
      toast.info(texts[language].noChanges);
      return;
    }

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
        toast.success(texts[language].updateSuccess);
        setIsEditing({ email: false, name: false });
      } else {
        throw new Error(data.error || texts[language].errorUpdate);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="profile-container">
      <ToastContainer />
      <div className="profile">
        <h1>{texts[language].profile}</h1>

        <div className="profile-field">
          <label>{texts[language].email}</label>
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
          <label>{texts[language].name}</label>
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
            {texts[language].updateProfile}
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
