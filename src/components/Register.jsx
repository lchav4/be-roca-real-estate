import React, { useState } from 'react';
import { Container, Form, Button, Card, InputGroup } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useLanguage } from '../app/LanguageContext';
import { Hourglass } from 'react-loader-spinner';

const Register = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();

  const texts = {
    es: {
      title: 'Crear una cuenta',
      details: 'Ingresa tus detalles',
      name: 'Nombre',
      email: 'Email',
      password: 'Contraseña',
      confirmPassword: 'Confirmar contraseña',
      toLogin: 'Volver al inicio de sesión',
      continue: 'Continuar',
      requiredFields: 'Todos los campos son requeridos',
      passwordsNotMatch: 'Las contraseñas no coinciden',
      userExists: 'El usuario ya existe',
      userCreated: 'Usuario creado correctamente',
      createError: 'Error al crear usuario',
    },
    en: {
      title: 'Create an account',
      details: 'Enter your credentials',
      name: 'Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm password',
      toLogin: 'Go back to log in',
      continue: 'Continue',
      requiredFields: 'All fields are required',
      passwordsNotMatch: 'Passwords do not match',
      userExists: 'User already exists',
      userCreated: 'User created successfully',
      createError: 'Error creating user',
    },
  };

  const translateError = (error) => {
    if (error.message.includes("El usuario ya existe") || error.message.includes("User already exists")) {
      return texts[language].userExists;
    }
    return texts[language].createError;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      if (!email || !name || !password || !confirmPassword) {
        return toast.info(texts[language].requiredFields);
      }
      if (password !== confirmPassword) {
        return toast.error(texts[language].passwordsNotMatch);
      }
      setLoading(true);
      
      const response = await fetch('/api/register', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, password }),
      });

      const data = await response.json();
      setLoading(false);
      
      if (response.status === 200) {
        toast.success(texts[language].userCreated);
        setTimeout(() => {
          onBackToLogin();
        }, 2000);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setLoading(false);
      toast.error(translateError(error));
    }
  };

  return (
    <>
      <ToastContainer />
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <Card style={{ width: '100%', maxWidth: '400px' }}>
          <Card.Body className="p-4">
            <div className="text-center mb-4">
              <img src="/roca-real-logo.png" alt="Logo" style={{ width: '100px', height: '100px' }} />
            </div>
            <h2 className="text-center mb-2">{texts[language].title}</h2>
            <p className="text-center text-muted mb-4">{texts[language].details}</p>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>{texts[language].email}</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>{texts[language].name}</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>{texts[language].password}</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
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
              <Form.Group className="mb-4" controlId="formConfirmPassword">
                <Form.Label>{texts[language].confirmPassword}</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <Button
                    variant="outline-secondary" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputGroup>
              </Form.Group>
              <Button variant="dark" type="submit" className="w-100">
                {loading ?
                (<Hourglass colors={['#DDD', '#AAA']} radius={"5px"} height={30} width={30} />) :
                texts[language].continue}
              </Button>
              <div className="text-center mt-3">
                <Button variant="link" onClick={onBackToLogin}>{texts[language].toLogin}</Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default Register;
