import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';

const HomePage = () => {
  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={6}>
          <h1>Bienvenidos a Costa Rica</h1>

          <h3>Nuestra misión</h3>
          <p>Brindar un servicio personalizado y profesional para encontrar la propiedad que más se ajuste a los sueños de cada uno de nuestros clientes.</p>

          <h3>Nuestra visión</h3>
          <p>Ser reconocidos como la empresa de bienes raíces que marca la diferencia, asesorando y acompañando en cada paso que sea necesario para que cada uno de nuestros clientes logre cumplir sus objetivos.</p>

          <h3>Servicios brindados</h3>
          <p>Contamos con un equipo de profesionales como un administrador de empresas con gran experiencia, abogados, topógrafos, ingenieros y arquitectos. Inclusión de propiedades en nuestra lista de venta, asesoramiento financiero, asesoramiento sobre las zonas de mayor potencial para comprar, realizamos solicitudes de los requisitos necesarios, gestiones municipales, informes de rendimiento, planos, asesoría legal, asesoría y acompañamiento para la construcción.</p>
        </Col>
        <Col md={6}>
        <img
            src={'/main-img.png'}
            className="d-inline-block align-top"
            alt="Logo"
          />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <p>Lic. Danny Alfaro Trejos</p>
          <p>Teléfono de empresa: (+506) 6451-6553</p>
          <p>Email: recostaricarealty@gmail.com</p>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;