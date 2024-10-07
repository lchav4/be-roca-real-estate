import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import "./Profile.css";

const PropertyInformation = ({ property }) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  if (!property) {
    return <p>No hay información de la propiedad disponible.</p>;
  }

  const imageUrl = `/uploads/${property.title}_0.jpg`;
  const phoneNumber = '50687300459'; 

  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que el formulario se envíe y recargue la página

    const message = `Hola, me interesa la propiedad: ${property.title}.\nMi nombre es ${contactName}.\nPuedes contactarme al email: ${contactEmail}.\n Comentarios: ${contactMessage}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');

    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  return (
    <Container className="my-4">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center">{property.title}</h1>
          <h5 className="text-center text-muted">{property.location}</h5>
        </Col>
      </Row>

      <Row>
        <Col xs={12} md={6}>
          <Card.Img 
            src={imageUrl} 
            alt={property.title} 
            style={{ maxHeight: '350px', objectFit: 'cover', width: '100%' }}
            className="mb-3"
          />
            {/* TO DO */}
          <Row className="mb-3">
            {[1, 2, 3, 4].map((index) => (
              <Col xs={6} sm={3} key={index}>
                <img
                  src={`/uploads/${property.title}_${index}.jpg`}
                  alt={`Imagen ${index}`}
                  className="img-thumbnail"
                  style={{ height: '100px', width: '100%', objectFit: 'cover' }}
                />
              </Col>
            ))}
          </Row>
        </Col>
        <Col xs={12} md={6}>
        <ul className="listado">
            <li><strong>Provincia:</strong> {property.province}</li>
            <li><strong>Region:</strong> {property.region}</li>
            <li><strong>Terreno:</strong> {property.landSize} m²</li>
            <li><strong>Precio Venta:</strong> {property.salePrice} USD</li>
          </ul>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col xs={12} md={6}>
          <p>{property.description}</p>
        </Col>

        <Col xs={12} md={6}>
          <Card className="mx-auto" style={{ maxWidth: '300px' }}>
            <Card.Body>
              <Card.Title>Contactar un agente hoy</Card.Title>
              <Form onSubmit={handleSubmit}> 
                <Form.Group controlId="contactName" className="mb-3">
                  <Form.Label>Nombre completo</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Ingrese su nombre" 
                    value={contactName} 
                    onChange={(e) => setContactName(e.target.value)} 
                  />
                </Form.Group>

                <Form.Group controlId="contactEmail" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Ingrese su email" 
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="contactMessage" className="mb-3">
                  <Form.Label>Comentarios</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    placeholder="Escriba su mensaje" 
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                  />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Me interesa esta propiedad
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col className="d-flex justify-content-between">
          <Button variant="secondary">Regresar</Button>
          <Button variant="primary">Guardar en favoritos</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default PropertyInformation;
