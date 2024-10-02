import React, { useEffect, useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { useLanguage } from '../app/LanguageContext';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from './AuthProvider';

const Header = ({ onNavigate }) => {
  const { toggleLanguage, language } = useLanguage();
  const [userInfo, setUserInfo] = useState(null);
  const { auth, logout } = useAuth();

  useEffect(() => {
    if (auth) {
      const decodedToken = jwtDecode(auth);
      setUserInfo(decodedToken);
    } else {
      setUserInfo(null);
    }
  }, [auth]);

  const texts = {
    es: {
      home: 'Inicio',
      search: 'Buscar',
      english: 'Inglés',
      logout: 'Cerrar sesión',
    },
    en: {
      home: 'Home',
      search: 'Search',
      english: 'Spanish',
      logout: 'Logout',
    },
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand onClick={() => onNavigate('home')}>
        <img
          src={'/roca-real-logo.png'}
          width="30"
          height="30"
          className="d-inline-block align-top ms-4"
          alt="Logo"
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          {userInfo && (
            <>
              <Nav.Link onClick={() => onNavigate('home')}>{texts[language].home}</Nav.Link>
              <Nav.Link onClick={() => onNavigate('search')}>{texts[language].search}</Nav.Link>
            </>
          )}
          <Nav.Link onClick={toggleLanguage}>{texts[language].english}</Nav.Link>
        </Nav>
        <Nav className="ms-auto">
          {userInfo && (
            <Nav.Link onClick={() => onNavigate('profile')}>{userInfo.username}</Nav.Link> // Redirige al perfil
          )}
          <Nav.Link onClick={logout}>{texts[language].logout}</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
