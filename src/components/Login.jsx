import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = ({onRegisterClick, onHomePageClick}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted', { email, password });
    // Aquí iría la lógica de autenticación
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }} className="p-4">
        <div className="text-center mb-4">
          <div style={{ width: '100px', height: '100px' }} className="bg-light rounded-circle mx-auto d-flex align-items-center justify-content-center">
          <img src="/roca-real-logo.png" alt="Logo" style={{ width: '100px', height: '100px' }} />
          </div>
        </div>
        <Card.Title className="text-center mb-4">Bienvenido</Card.Title>
        <Card.Subtitle className="text-center text-muted mb-4">Ingresa tus detalles</Card.Subtitle>
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
            <Form.Control
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          
          <div className="text-end mb-3">
            <a href="#" className="text-primary text-decoration-none">¿Olvidó su contraseña?</a>
          </div>
          
          <Button variant="dark" type="submit" className="w-100" onClick={onHomePageClick}>
            Continuar
          </Button>
        </Form>
        <div className="text-center mt-3">
          <Button variant="link" onClick={onRegisterClick}>¿No tiene cuenta? Regístrese</Button>
        </div>
      </Card>
    </Container>
  );
};

export default Login;
