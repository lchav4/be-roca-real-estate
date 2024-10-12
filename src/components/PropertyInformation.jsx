import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import "./Profile.css";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { useAuth } from "./AuthProvider";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";

const PropertyInformation = ({ property }) => {
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [thumbnailStart, setThumbnailStart] = useState(0); // Índice de la primera miniatura visible
  const [favorite, setFavorite] = useState(false);
  const carouselRef = useRef(null);

  const thumbnailLimit = 5; // Límite de miniaturas a mostrar
  const { auth } = useAuth();

  if (!property) {
    return <p>No hay información de la propiedad disponible.</p>;
  }

  useEffect(() => {
    const decodedToken = jwtDecode(auth);
    const email = decodedToken.email;
    fetch("/api/allFavorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }).then(async (response) => {
      if (response.status === 200) {
        const favorites = await response.json();
        setFavorite(favorites.includes(property._id));
      } else {
        console.error("Ha ocurrido un error al cargar los favoritos");
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
  

  // Mostrar solo las miniaturas dentro del límite
  const visibleThumbnails = items.slice(
    thumbnailStart,
    thumbnailStart + thumbnailLimit
  );

  const handleNextThumbnails = () => {
    if (thumbnailStart + thumbnailLimit < items.length) {
      setThumbnailStart(thumbnailStart + 1); // Avanza un índice
    }
  };

  const handlePrevThumbnails = () => {
    if (thumbnailStart > 0) {
      setThumbnailStart(thumbnailStart - 1); // Retrocede un índice
    }
  };

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
        marginRight: "20px",
        marginTop: "30px", marginLeft: "20px"
      }}
      alt={`Thumbnail ${index + 1}`}
    />
  ));

  const handleFavorite = async (e) => {
    e.preventDefault();
    try {
      const decodedToken = jwtDecode(auth);
      const email = decodedToken.email;

      const response = await fetch("/api/favorite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ propertyTitle: property.title, email, isAdding: !favorite }),
      });

      if (response.status === 200) {
        setFavorite(!favorite);
      } else {
        throw new Error("Ha ocurrido un error al guardar");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  

  return (
    <>
      <ToastContainer />
      <Container className="responsive">
        <Row className="mb-4">
          <Col>
            <h1 className="text-center">{property.title}</h1>
            <h5 className="text-center text-muted">{property.location}</h5>
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
            <div className="d-flex justify-content-center m-3" >
              {thumbnails}
            </div>
          </Col>

          <Col xs={12} md={6} className="mb-3" style={{ paddingLeft: "50px" }}>
            <ul className="listado">
              
              <li>
                <strong>Región:</strong> {property.region}
              </li>
              <li>
                <strong>Terreno:</strong> {property.landSize} m²
              </li>
              {property.salePrice ? (
                <li>
                  <strong>Precio venta: </strong> ${property.salePrice} USD
                </li>
              ) : (
                <li>
                  <strong>Precio renta: </strong> ${property.rentPrice} USD
                </li>
              )}
            </ul>

            <Card className="mx-auto" style={{ maxWidth: "400px" }}>
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
          <Col xs={12} md={6}>
            <h4>Descripción</h4>
            <p style={{ whiteSpace: 'pre-line' }}>{property.description}</p>

          </Col>
        </Row>

        <Row className="mt-4">
          <Col className="d-flex justify-content-between" >
            <Button variant="secondary">Regresar</Button>
            <Button variant="primary" onClick={handleFavorite}>
              {favorite ? (
                <>
                  Guardado en favoritos
                  <FaHeart className="m-1" />
                </>
              ) : (
                <>
                  Guardar en favoritos
                  <FaRegHeart className="m-1" />
                </>
              )}
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PropertyInformation;
