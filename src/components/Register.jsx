import React, { useState } from 'react';
import { Container, Form, Button, Card, InputGroup } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (email.length === 0 || name.length === 0 || password.length === 0 || confirmPassword.length === 0)
        return toast.info('Todos los campos son requeridos');
      if (password !== confirmPassword)
        return toast.error('Las contraseñas no coinciden');
      const response = await fetch(`api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, password }),
      });
      const data = await response.json();
      toast.success('Usuario creado correctamente');
      if (response.status === 200) {
        setTimeout(() => {
          onBackToLogin();
        }, 2000);
      } else {
        throw new Error(`${data.error}`);
      }
    } catch (error) {
      toast.error('Error al crear usuario');
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
            <h2 className="text-center mb-2">Crear una cuenta</h2>
            <p className="text-center text-muted mb-4">Ingresa tus detalles</p>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Contraseña</Form.Label>
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
                <Form.Label>Confirmar contraseña</Form.Label>
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
                Continuar
              </Button>
              <div className="text-center mt-3">
                <Button variant="link" onClick={onBackToLogin}>Volver al inicio de sesión</Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default Register;
