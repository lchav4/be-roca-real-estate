import { useState, useEffect } from 'react';
import { Container, Form, Button, Card, InputGroup } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [token, setToken] = useState('');
    const router = useRouter();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setToken(params.get('token')); 
    }, []);
   
    const handleSubmit = async (event) => {
        event.preventDefault();

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
                        <h2 className="text-center mb-2">Restablecer Contraseña</h2>
                        <p className="text-center text-muted mb-4">Ingresa tu nueva contraseña</p>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formNewPassword">
                                <Form.Label>Nueva Contraseña</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
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
                                <Form.Label>Confirmar Contraseña</Form.Label>
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
                                Restablecer Contraseña
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default ResetPassword;
