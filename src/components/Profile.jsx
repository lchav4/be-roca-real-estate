import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPen } from "react-icons/fa";
import { useLanguage } from '../app/LanguageContext';
import { useAuth } from "./AuthProvider";
import { jwtDecode } from "jwt-decode";
import "./Profile.css";

const Profile = ({ user, toPropertyResults }) => {
  const [isEditing, setIsEditing] = useState({
    email: false,
    name: false,
  });
  const [updatedUser, setUpdatedUser] = useState({
    email: user.email,
    name: user.username,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { language } = useLanguage();
  const { auth, logout } = useAuth();

  const texts = {
    es: {
      profile: 'Perfil',
      email: 'Correo electrónico:',
      name: 'Nombre:',
      updateSuccess: 'Perfil actualizado correctamente!',
      noChanges: 'Ningún campo ha sido modificado.',
      updateProfile: 'Actualizar Perfil',
      errorUpdate: 'Error al actualizar el perfil',
      deleteAccount: 'Eliminar cuenta',
      confirmDelete: '¿Estás seguro de que deseas eliminar tu cuenta?',
      delete: 'Eliminar',
      cancel: 'Cancelar',
      viewFavorites: 'Ver propiedades favoritas',
    },
    en: {
      profile: 'Profile',
      email: 'Email:',
      name: 'Name:',
      updateSuccess: 'Profile updated successfully!',
      noChanges: 'No fields have been modified.',
      updateProfile: 'Update Profile',
      errorUpdate: 'Error updating profile',
      deleteAccount: 'Delete Account',
      confirmDelete: 'Are you sure you want to delete your account?',
      delete: 'Delete',
      cancel: 'Cancel',
      viewFavorites: 'View Favorite Properties',
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

  const handleDeleteAccount = () => {
    setIsModalOpen(true);
  };

  const confirmDeleteAccount = async () => {
    setIsModalOpen(false); 
  
    try {
      const decodedToken = jwtDecode(auth);
      const email = decodedToken.email;
  
      const response = await fetch("/api/deleteUser", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
  
      if (response.ok) {
        toast.success(texts[language].deleteAccount); 
        logout(); 
      } else {
        const data = await response.json();
        throw new Error(data.error || "Error al eliminar la cuenta."); 
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  const handleViewFavorites = async () => {
    const decodedToken = jwtDecode(auth);
    const email = decodedToken.email;
    try {
      const response = await fetch('/api/getFavorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const properties = await response.json();
      toPropertyResults(properties);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="profile-container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <ToastContainer />
      <div className="profile">
        <h1>{texts[language].profile}</h1>

        <div className="profile-field" style={{ marginBottom: '10px' }}>
          <label>{texts[language].email}</label>
          <input
            type="email"
            name="email"
            value={updatedUser.email}
            disabled={!isEditing.email}
            onChange={handleChange}
            className={isEditing.email ? "editable" : "disabled"}
            style={{ marginLeft: '10px', padding: '5px', width: 'calc(100% - 50px)' }}
          />
          <FaPen
            className="edit-icon"
            onClick={() => handleEditClick("email")}
            style={{ cursor: 'pointer', marginLeft: '10px' }}
          />
        </div>

        <div className="profile-field" style={{ marginBottom: '10px' }}>
          <label>{texts[language].name}</label>
          <input
            type="text"
            name="name"
            value={updatedUser.name}
            disabled={!isEditing.name}
            onChange={handleChange}
            className={isEditing.name ? "editable" : "disabled"}
            style={{ marginLeft: '10px', padding: '5px', width: 'calc(100% - 50px)' }}
          />
          <FaPen
            className="edit-icon"
            onClick={() => handleEditClick("name")}
            style={{ cursor: 'pointer', marginLeft: '10px' }}
          />
        </div>

        {(isEditing.email || isEditing.name) && (
          <button className="save-button" onClick={handleSave}>
            {texts[language].updateProfile}
          </button>
        )}
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            cursor: "pointer",
            marginTop: "10px",
            border: "none",
            borderRadius: "5px",
            width: "100%",
          }}
          onClick={handleViewFavorites}
        >
          {texts[language].viewFavorites}
        </button>
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "white",
            cursor: "pointer",
            marginTop: "10px",
            border: "none",
            borderRadius: "5px",
            width: "100%",
          }}
          onClick={handleDeleteAccount}
        >
          {texts[language].deleteAccount}
        </button>

        {/* Modal para confirmación de eliminación */}
        {isModalOpen && (
          <div className="modal" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="modal-content" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px', textAlign: 'center' }}>
              <h2>{texts[language].confirmDelete}</h2>
              <button onClick={confirmDeleteAccount} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', marginRight: '10px' }}>
                {texts[language].delete}
              </button>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
                {texts[language].cancel}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
