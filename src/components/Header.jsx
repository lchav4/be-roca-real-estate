import React, { useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useLanguage } from '../app/LanguageContext';
import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from './AuthProvider';

const Header = () => {
  const { toggleLanguage, language } = useLanguage(); 
  const [userInfo, setUserInfo] = useState(null);
  const { logout } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserInfo(decodedToken);
    }
  }, []);



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
      <Container>
        <Navbar.Brand href="#home">
          <img
            src={'/roca-real-logo.png'}
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="Logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#inicio">{texts[language].home}</Nav.Link>
            <Nav.Link href="#buscar">{texts[language].search}</Nav.Link>
            <Nav.Link onClick={toggleLanguage}>{texts[language].english}</Nav.Link>
            {userInfo ? (
              <Nav.Link href="#profile">{userInfo.username}</Nav.Link>
            ) : (
              <Nav.Link href="#login">NA</Nav.Link>
            )}
            <Nav.Link onClick={logout}>{texts[language].logout}</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
