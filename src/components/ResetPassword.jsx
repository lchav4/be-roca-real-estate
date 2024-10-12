
import { useState, useEffect } from "react";
import { Container, Form, Button, Card, InputGroup } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useLanguage } from "../app/LanguageContext"; 

const ResetPassword = ({ onBacktoLogin }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState("");
  const router = useRouter();
  const { language } = useLanguage(); 

  const texts = {
    es: {
      title: 'Restablecer contraseña',
      password: 'Ingresa tu nueva contraseña',
      newPassword: 'Nueva contraseña',
      confirmPassword: 'Confirmar nueva contraseña',
      reset: 'Restablecer contraseña'
    },
    en: {
      title: 'Reset password',
      password: 'Enter your new password',
      newPassword: 'New password',
      confirmPassword: 'Confirm new password', 
      reset: 'Reset password'
    },
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token"));
  }, []); 

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (newPassword === confirmPassword) {
        const response = await fetch("/api/resetPassword", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, password: newPassword }),
        });

        if (response.status === 200) {
          toast.success(language === 'es' ? "Contraseña actualizada correctamente" : "Password updated successfully");
          router.push("/main");
        } else {
          const data = await response.json();
          throw new Error(data.error || 'Error desconocido'); 
        }
      } else {
        toast.error(language === 'es' ? "Las contraseñas no coinciden" : "Passwords do not match");
      }
    } catch (error) {
      toast.error(`Error: ${error.message || (language === 'es' ? 'Error al restablecer la contraseña' : 'Error resetting password')}`); 
    }
  };

  return (
    <>
      <ToastContainer />
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <Card style={{ width: "100%", maxWidth: "400px" }}>
          <Card.Body className="p-4">
            <div className="text-center mb-4">
              <img
                src="/roca-real-logo.png"
                alt="Logo"
                style={{ width: "100px", height: "100px" }}
              />
            </div>
            <h2 className="text-center mb-2">{texts[language].title}</h2>
            <p className="text-center text-muted mb-4">
              {texts[language].password}
            </p>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formNewPassword">
                <Form.Label>{texts[language].newPassword}</Form.Label> 
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
                {texts[language].reset}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default ResetPassword;
