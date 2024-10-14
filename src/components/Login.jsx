import React, { useState } from 'react';
import { Container, Form, Button, Card, InputGroup } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import { useAuth } from './AuthProvider';
import { useLanguage } from '../app/LanguageContext';
import { Hourglass } from 'react-loader-spinner'

const Login = ({ onRegisterClick, onForgotPasswordClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { language } = useLanguage();

  const texts = {
    es: {
      welcome: 'Bienvenido',
      details: 'Ingresa tus detalles',
      password: 'Contraseña',
      forgotPassword: '¿Olvidó su contraseña?',
      noAccount: '¿No tiene cuenta? Regístrese',
      continue: 'Continuar'
    },
    en: {
      welcome: 'Welcome',
      details: 'Enter your credentials',
      password: 'Password',
      forgotPassword: 'Forgot your password?',
      noAccount: 'Don’t have an account? Sign up',
      continue: 'Continue'
    },
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log('Form submitted', { email, password });
      if (email.length === 0 || password.length === 0)
        throw new Error('Email and password are required');
      setLoading(true);

      const response = await fetch('/api/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      setLoading(false);
      if (response.status === 200) {
        const { token } = data;
        login(token);
        localStorage.setItem('token', token);
      } else {
        throw new Error(data.error); 
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message); 
      console.error('An error occurred', error);
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
          <Card.Title className="text-center mb-4">{texts[language].welcome}</Card.Title>
          <Card.Subtitle className="text-center text-muted mb-4">{texts[language].details}</Card.Subtitle>
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

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"} 
                  placeholder={texts[language].password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)} 
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />} 
                </Button>
              </InputGroup>
            </Form.Group>

            <div className="text-end mb-3">
              <Button variant="link" className="p-0" onClick={onForgotPasswordClick}>
                {texts[language].forgotPassword}
              </Button>
            </div>

            <Button variant="dark" type="submit" className="w-100 d-flex justify-content-center align-items-center">
              {loading ? 
              (<Hourglass  colors={['#DDD', '#AAA']} radius={"5px"} height={30} width={30} />) :
              texts[language].continue}
              
            </Button>
          </Form>
          <div className="text-center mt-3">
            <Button variant="link" onClick={onRegisterClick}>{texts[language].noAccount}</Button>
          </div>
        </Card>
      </Container>
    </>
  );
};

export default Login;
