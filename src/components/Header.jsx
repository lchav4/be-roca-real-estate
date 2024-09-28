import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useLanguage } from '../app/LanguageContext';

const Header = () => {
  const { toggleLanguage, language } = useLanguage(); 


  const texts = {
    es: {
      home: 'Inicio',
      search: 'Buscar',
      english: 'Inglés',
    },
    en: {
      home: 'Home',
      search: 'Search',
      english: 'Spanish',
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
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
