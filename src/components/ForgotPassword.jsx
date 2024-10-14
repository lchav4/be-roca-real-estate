import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLanguage } from '../app/LanguageContext';
import { Hourglass } from 'react-loader-spinner';

const ForgotPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();

  const texts = {
    es: {
      title: 'Restablecer contraseña',
      email: 'Ingresa el correo electrónico que usaste para registrarte',
      sendLink: 'Enviar enlace de restablecimiento',
      toLogin: 'Regresar a iniciar sesión'
    },
    en: {
      title: 'Reset password',
      email: 'Enter the email address you used to sign up',
      sendLink: 'Send reset link',
      toLogin: 'Go back to log in'
    },
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const actualLanguage=language;
    try {
      setLoading(true);
      if (email.length === 0) throw new Error('Email is required');

      const response = await fetch('/api/forgotPassword', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email,actualLanguage }),
      });

      const data = await response.json();
      setLoading(false);
      if (response.status === 200) {
        toast.success('An email has been sent to reset your password');
      } else {
        throw new Error(data.error); 
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message); 
    }
  };

  return (
    <>
      <ToastContainer />
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <Card style={{ width: '100%', maxWidth: '400px' }} className="p-4">
          <div className="text-center mb-4">
            <div style={{ width: '100px', height: '100px' }} className="bg-light rounded-circle mx-auto d-flex align-items-center justify-content-center">
              <img src="/roca-real-logo.png" alt="Logo" style={{ width: '100px', height: '100px' }} />
            </div>
          </div>
          <Card.Title className="text-center mb-4">{texts[language].title}</Card.Title>
          <Card.Subtitle className="text-center text-muted mb-4">
            {texts[language].email}
          </Card.Subtitle>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="dark" type="submit" className="w-100">
              {loading ?
              (<Hourglass  colors={['#DDD', '#AAA']} radius={"5px"} height={30} width={30} />) :
              texts[language].sendLink}
            </Button>
          </Form>
          <div className="text-center mt-3">
            <Button variant="link" onClick={onBackToLogin}>{texts[language].toLogin}</Button>
          </div>
        </Card>
      </Container>
    </>
  );
};

export default ForgotPassword;
