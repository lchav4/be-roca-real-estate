import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLanguage } from '../app/LanguageContext'; 

const Footer = () => {
  const { language } = useLanguage(); 

  const texts = {
    es: {
      name: 'Lic. Danny Alfaro Trejos',
      phone: 'Teléfono de empresa: (+506) 6451-6553',
      email: 'Email: recostaricarealty@gmail.com',
    },
    en: {
      name: 'Lic. Danny Alfaro Trejos',
      phone: 'Company phone: (+506) 6451-6553',
      email: 'Email: recostaricarealty@gmail.com',
    },
  };

  return (
    <footer className="bg-dark text-light mt-4" style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
      <Container>
        <Row className="py-1"> 
          <Col className="text-center">
            <p className="mb-0">{texts[language].name}</p> 
            <p className="mb-0">{texts[language].phone}</p> 
            <p className="mb-0">{texts[language].email}</p> 
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
