import React from "react";
import "./Profile.css";
import { useLanguage } from "../app/LanguageContext";

const Profile = ({ user }) => {
  const { language } = useLanguage();

  const texts = {
    es: {
      loading: "Cargando...",
      email: "Correo electrónico:",
      name: "Nombre:",
    },
    en: {
      loading: "Loading...",
      email: "Email:",
      name: "Name:",
    },
  };

  if (!user) {
    return <div className="loading">{texts[language].loading}</div>;
  }

  return (
    <div className="profile">
      <h1>{user.username}</h1>
      <p>
        <span>{texts[language].email}</span> {user.email}
      </p>
      <p>
        <span>{texts[language].name}</span> {user.username}
      </p>
    </div>
  );
};

export default Profile;
