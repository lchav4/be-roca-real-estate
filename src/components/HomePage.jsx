import React from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import { useLanguage } from '../app/LanguageContext';

const HomePage = () => {
  const { language } = useLanguage();

  const texts = {
    es: {
      welcome: 'Bienvenidos a Costa Rica',
      mission: 'Nuestra misión',
      missionDescription: 'Brindar un servicio personalizado y profesional para encontrar la propiedad que más se ajuste a los sueños de cada uno de nuestros clientes.',
      vision: 'Nuestra visión',
      visionDescription: 'Ser reconocidos como la empresa de bienes raíces que marca la diferencia, asesorando y acompañando en cada paso que sea necesario para que cada uno de nuestros clientes logre cumplir sus objetivos.',
      services: 'Servicios brindados',
      servicesDescription: 'Contamos con un equipo de profesionales como un administrador de empresas con gran experiencia, abogados, topógrafos, ingenieros y arquitectos. Inclusión de propiedades en nuestra lista de venta, asesoramiento financiero, asesoramiento sobre las zonas de mayor potencial para comprar, realizamos solicitudes de los requisitos necesarios, gestiones municipales, informes de rendimiento, planos, asesoría legal, asesoría y acompañamiento para la construcción.',
    },
    en: {
      welcome: 'Welcome to Costa Rica',
      mission: 'Our mission',
      missionDescription: 'To provide personalized and professional service to find the property that best suits the dreams of each of our clients.',
      vision: 'Our vision',
      visionDescription: 'To be recognized as the real estate company that makes a difference, advising and accompanying in every step necessary for each of our clients to achieve their goals.',
      services: 'Provided services',
      servicesDescription: 'We have a team of professionals including a business administrator with great experience, lawyers, surveyors, engineers, and architects. Inclusion of properties in our sales list, financial advice, advice on the areas of greatest potential for purchase, we handle requests for necessary requirements, municipal management, performance reports, plans, legal advice, and assistance for construction.',
    },
  };

  return (
    <Container fluid className="mt-4"style={{ marginBottom: "50px"}} >
      <Row>
        <Col md={6}>
          <h1>{texts[language].welcome}</h1>
          <h3>{texts[language].mission}</h3>
          <p>{texts[language].missionDescription}</p>
          <h3>{texts[language].vision}</h3>
          <p>{texts[language].visionDescription}</p>
          <h3>{texts[language].services}</h3>
          <p>{texts[language].servicesDescription}</p>
        </Col>
        <Col md={6}>
          <Carousel interval={5000} className="h-100">
            <Carousel.Item>
              <img
                src={'/main-img1.png'}
                style={{ height: '600px', objectFit: 'cover', width: '100%' }}
                className="d-block"
                alt="Imagen 1"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                src={'/main-img2.jpg'}
                style={{ height: '600px', objectFit: 'cover', width: '100%' }}
                className="d-block"
                alt="Imagen 2"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                src={'/main-img3.jpg'}
                style={{ height: '600px', objectFit: 'cover', width: '100%' }}
                className="d-block"
                alt="Imagen 3"
              />
            </Carousel.Item>
          </Carousel>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
