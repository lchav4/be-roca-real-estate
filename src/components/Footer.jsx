import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import "./Profile.css";
import { useLanguage } from '../app/LanguageContext'; 

const Footer = () => {
  const { language } = useLanguage(); 

  const texts = {
    es: {
      name: 'Lic. Danny Alfaro Trejos',
      phone: 'Teléfono de empresa: (+506) 8451-6553',
      email: 'Email: rocarealestatecr@gmail.com',
    },
    en: {
      name: 'Lic. Danny Alfaro Trejos',
      phone: 'Company phone: (+506) 8451-6553',
      email: 'Email: rocarealestatecr@gmail.com',
    },
  };

  return (
    <footer className="bg-dark text-light sticky-footer" style={{borderTop: '1px solid #dee2e6' }}>
      <Container fluid>
        <Row className="py-2 align-items-center">
          <Col xs={12} md={4} className="text-center text-md-start">
            <small>{texts[language].name}</small>
          </Col>
          <Col xs={12} md={4} className="text-center">
            <small>{texts[language].phone}</small>
          </Col>
          <Col xs={12} md={4} className="text-center text-md-end">
            <small>{texts[language].email}</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
