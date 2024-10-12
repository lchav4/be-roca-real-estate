import React, { useEffect, useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { useLanguage } from '../app/LanguageContext';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from './AuthProvider';

const Header = ({ onNavigate }) => {
  const { toggleLanguage, language } = useLanguage();
  const [userInfo, setUserInfo] = useState(null);
  const { auth, logout } = useAuth();
  const [expanded, setExpanded] = useState(false); // Track if navbar is expanded

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
      admin: 'Publicar propiedad',
      profile: 'Perfil',
      english: 'Inglés',
      logout: 'Cerrar sesión',
    },
    en: {
      home: 'Home',
      search: 'Search',
      admin: 'Publish property',
      profile: 'Profile',
      english: 'Spanish',
      logout: 'Logout',
    },
  };

  const handleNavigate = (page) => {
    onNavigate(page);
    setExpanded(false); // Collapse menu after click
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" expanded={expanded}>
      <Navbar.Brand onClick={() => handleNavigate('home')}>
        <img
          src={'/roca-real-logo.png'}
          width="30"
          height="30"
          className="d-inline-block align-top ms-4"
          alt="Logo"
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          {userInfo && (
            <>
              <Nav.Link onClick={() => handleNavigate('home')}>{texts[language].home}</Nav.Link>
              <Nav.Link onClick={() => handleNavigate('search')}>{texts[language].search}</Nav.Link>

              {/* Show Admin link if the user is an admin */}
              {userInfo.role === 'ADMIN' && (
                <Nav.Link onClick={() => handleNavigate('admin')}>{texts[language].admin}</Nav.Link>
              )}
            </>
          )}
          <Nav.Link onClick={toggleLanguage}>{texts[language].english}</Nav.Link>
        </Nav>
        <Nav className="ms-auto">
          {userInfo && (
            <>
              {/* Show Profile for any logged-in user */}
              <Nav.Link onClick={() => handleNavigate('profile')}>
                {texts[language].profile}: {userInfo.username}
              </Nav.Link>
              <Nav.Link onClick={logout}>{texts[language].logout}</Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
