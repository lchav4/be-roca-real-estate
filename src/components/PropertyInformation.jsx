
import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useAuth } from "./AuthProvider";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import { useLanguage } from '../app/LanguageContext'; // Importa el contexto de idioma

const PropertyInformation = ({ property }) => {
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [thumbnailStart, setThumbnailStart] = useState(0);
  const [thumbnailsToShow, setThumbnailsToShow] = useState(3);
  const [favorite, setFavorite] = useState(false);
  const carouselRef = useRef(null);
  const { auth } = useAuth();
  const { language } = useLanguage(); // Usar el idioma actual

  const texts = {
    es: {
      title: 'Título de la propiedad:',
      location: 'Ubicación:',
      province: 'Provincia:',
      region: 'Región:',
      landSize: 'Terreno:',
      salePrice: 'Precio venta:',
      rentPrice: 'Precio renta:',
      contactAgent: 'Contactar un agente hoy',
      fullName: 'Nombre completo',
      enterName: 'Ingrese su nombre',
      email: 'Correo electrónico',
      enterEmail: 'Ingrese su correo',
      message: 'Comentarios',
      enterMessage: 'Escriba su mensaje',
      interestedProperty: 'Me interesa esta propiedad',
      description: 'Descripción',
      saveFavorites: 'Guardar en favoritos',
      savedFavorites: 'Guardado en favoritos',
      back: 'Regresar'
    },
    en: {
      title: 'Property Title:',
      location: 'Location:',
      province: 'Province:',
      region: 'Region:',
      landSize: 'Land Size:',
      salePrice: 'Sale Price:',
      rentPrice: 'Rent Price:',
      contactAgent: 'Contact an agent today',
      fullName: 'Full Name',
      enterName: 'Enter your name',
      email: 'Email',
      enterEmail: 'Enter your email',
      message: 'Comments',
      enterMessage: 'Write your message',
      interestedProperty: 'I am interested in this property',
      description: 'Description',
      saveFavorites: 'Save to favorites',
      savedFavorites: 'Saved to favorites',
      back: 'Back'
    }
  };

  useEffect(() => {
    const decodedToken = jwtDecode(auth);
    const email = decodedToken.email;
    fetch("/api/allFavorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).then(async (response) => {
      if (response.status === 200) {
        const favorites = await response.json();
        setFavorite(favorites.includes(property._id));
      } else {
        console.error("Error loading favorites");
      }
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = `Hola, me interesa la propiedad: ${property.title}.\nMi nombre es ${contactName}.\nPuedes contactarme al email: ${contactEmail}.\n Comentarios: ${contactMessage}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/50684516553?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
    setContactName("");
    setContactEmail("");
    setContactMessage("");
  };

  const handleFavorite = async (e) => {
    e.preventDefault();
    try {
      const decodedToken = jwtDecode(auth);
      const email = decodedToken.email;
      const response = await fetch("/api/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyTitle: property.title, email, isAdding: !favorite }),
      });

      if (response.status === 200) {
        setFavorite(!favorite);
      } else {
        throw new Error("Error saving favorite");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDragStart = (e) => e.preventDefault();
  const items = property.imagesURL.map((imageURL, index) => (
    <img
      src={imageURL}
      style={{ height: "300px", objectFit: "cover", width: "100%" }}
      alt={`Imagen ${index + 1}`}
      onDragStart={handleDragStart}
    />
  ));

  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
    if (carouselRef.current) {
      carouselRef.current.slideTo(index);
    }
  };
  

  const visibleThumbnails = items.slice(thumbnailStart, thumbnailStart + thumbnailsToShow);
  const thumbnails = visibleThumbnails.map((item, index) => (
    <img
      key={index + thumbnailStart}
      className={`m-2 ${activeIndex === index + thumbnailStart ? 'selected' : ''}`}
      src={item.props.src}
      onClick={() => handleThumbnailClick(index + thumbnailStart)}
      style={{
        height: "100px",
        width: "100px",
        objectFit: "cover",
        cursor: "pointer",
        marginRight: "10px",
        border: activeIndex === index + thumbnailStart
          ? "2px solid black"
          : "2px solid transparent",
      }}
      alt={`Thumbnail ${index + 1}`}
    />
  ));

  useEffect(() => {
    const updateThumbnailsToShow = () => {
      const width = window.innerWidth;

      if (width < 576) {
        setThumbnailsToShow(1);
      } else if (width >= 576 && width < 900) {
        setThumbnailsToShow(2);
      } else if (width >= 900 && width < 1200) {
        setThumbnailsToShow(3);
      } else if (width >= 1200 && width < 1300) {
        setThumbnailsToShow(4);
      } else {
        setThumbnailsToShow(5);
      }
    };


    updateThumbnailsToShow();


    window.addEventListener("resize", updateThumbnailsToShow);


    return () => {
      window.removeEventListener("resize", updateThumbnailsToShow);
    };
  }, []);

  return (
    <>
      <ToastContainer />
      <Container className="responsive">
        <Row className="mb-4">
          <Col>
            <h1 className="text-center">{property.title}</h1>
            <h5 className="text-center text-muted">{texts[language].location} {property.location}</h5>
          </Col>
        </Row>

        <Row className="mb-3"  >
          <Col xs={12} md={6} className="mb-3"  style={{ paddingRight: "20px"}}>
            <AliceCarousel
              ref={carouselRef}
              mouseTracking
              items={items}
              activeIndex={activeIndex}
              disableDotsControls
              onSlideChanged={(e) => setActiveIndex(e.item)}
            />
            <div className="d-flex justify-content-center ml-5" style={{width: "100%"}} >
            <Button
                variant="outline-secondary"
                onClick={() => thumbnailStart > 0 && setThumbnailStart(thumbnailStart - 1)}
                disabled={thumbnailStart === 0}
              >
                {"<"}
              </Button>
              {thumbnails}
              <Button
                variant="outline-secondary"
                onClick={() => thumbnailStart + thumbnailsToShow < items.length && setThumbnailStart(thumbnailStart + 1)}
                disabled={thumbnailStart + thumbnailsToShow >= items.length}
              >
                {">"}
              </Button>
            </div>
          </Col>

          <Col xs={12} md={6} className="mb-3" style={{ paddingLeft: "50px" }}>
            <div className="d-flex justify-content-center pr-5" style={{width: "90%"}}>
            <ul className="listado">
            <li>
                <strong>{texts[language].region}</strong> {property.region} m²
              </li>
              <li>
                <strong>{texts[language].landSize}</strong> {property.landSize} m²
              </li>
              {property.salePrice ? (
                <li>
                  <strong>{texts[language].salePrice}</strong> ${property.salePrice} USD
                </li>
              ) : (
                <li>
                  <strong>{texts[language].rentPrice} </strong> ${property.rentPrice} USD
                </li>
              )}
            </ul>
            </div>
            <Card className="mx-auto" style={{ maxWidth: "400px" }}>
              <Card.Body>
                <Card.Title>{texts[language].contactAgent}</Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="contactName" className="mb-3">
                    <Form.Label>{texts[language].fullName}</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={texts[language].enterName}
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="contactEmail" className="mb-3">
                    <Form.Label>{texts[language].email}</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder={texts[language].enterEmail}
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="contactMessage" className="mb-3">
                    <Form.Label>{texts[language].message}</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder={texts[language].enterMessage}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    {texts[language].interestedProperty}
                  </Button>
                  </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col xs={12} md={6}>
            <h4>Descripción</h4>
            <p style={{ whiteSpace: 'pre-line' }}>{property.description}</p>

          </Col>
        </Row>

        <Row className="mt-4">
          <Col className="d-flex justify-content-between" >
          <Button variant="secondary" onClick={() => window.history.back()}>
                {texts[language].back}
          </Button>
          <Button
                variant="outline-primary"
                onClick={handleFavorite}
                className="me-2"
              >
                {favorite ? <FaHeart /> : <FaRegHeart />}
                {favorite ? ` ${texts[language].savedFavorites}` : ` ${texts[language].saveFavorites}`}
              </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PropertyInformation;








