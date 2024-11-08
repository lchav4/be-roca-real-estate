import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
} from "react-bootstrap";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useAuth } from "./AuthProvider";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import { useLanguage } from "../app/LanguageContext"; // Importa el contexto de idioma
import PropertyDeleteButton from "./PropertyDelete";

const PropertyInformation = ({ property }) => {
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [thumbnailStart, setThumbnailStart] = useState(0);
  const [thumbnailsToShow, setThumbnailsToShow] = useState(3);
  const [favorite, setFavorite] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const carouselRef = useRef(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedProperty, setEditedProperty] = useState({ ...property });
  const { auth } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const { language } = useLanguage(); // Usar el idioma actual

  const texts = {
    es: {
      title: "Título de la propiedad:",
      location: "Ubicación:",
      province: "Provincia:",
      region: "Región:",
      landSize: "Terreno:",
      salePrice: "Precio venta:",
      rentPrice: "Precio renta:",
      contactAgent: "Contactar un agente hoy",
      fullName: "Nombre completo",
      enterName: "Ingrese su nombre",
      email: "Correo electrónico",
      enterEmail: "Ingrese su correo",
      message: "Comentarios",
      enterMessage: "Escriba su mensaje",
      interestedProperty: "Me interesa esta propiedad",
      description: "Descripción",
      saveFavorites: "Guardar en favoritos",
      savedFavorites: "Guardado en favoritos",
      back: "Regresar",
      deleteProperty: "Eliminar propiedad",
      confirmDelete: "¿Está seguro de que desea eliminar esta propiedad?",
      edit: "Editar propiedad",
      editSuccess: "¡Propiedad actualizada con éxito!",
      editError: "Error al actualizar la propiedad.",
    },
    en: {
      title: "Property Title:",
      location: "Location:",
      province: "Province:",
      region: "Region:",
      landSize: "Land Size:",
      salePrice: "Sale Price:",
      rentPrice: "Rent Price:",
      contactAgent: "Contact an agent today",
      fullName: "Full Name",
      enterName: "Enter your name",
      email: "Email",
      enterEmail: "Enter your email",
      message: "Comments",
      enterMessage: "Write your message",
      interestedProperty: "I am interested in this property",
      description: "Description",
      saveFavorites: "Save to favorites",
      savedFavorites: "Saved to favorites",
      back: "Back",
      deleteProperty: "Delete Property",
      confirmDelete: "Are you sure you want to delete this property?",
      edit: "Edit property",
      editSuccess: "Property updated successfully!",
      editError: "Error updating property.",
    },
  };

  const propiedades = [
    "Apartamentos",
    "Bodegas",
    "Cabinas - Cabañas",
    "Casas",
    "Casas de hospedaje",
    "Centros Turísticos",
    "Consultorio Médico",
    "Desarrollos y Proyectos",
    "Edificios",
    "Estación de Servicio",
    "Fincas",
    "Hoteles",
    "Locales Comerciales",
    "Negocios funcionando",
    "Oficinas",
    "Quintas",
    "Restaurantes",
    "Terrenos | Lotes",
  ];

  const regiones = [
    "Guanacaste | Pacífico Norte",
    "Limón | Caribe",
    "Pérez Zeledón",
    "Puntarenas | Pacífico sur",
    "Valle Central",
    "Zona Norte",
    "Zona Pacífico Sur",
  ];

  useEffect(() => {
    if (auth) {
      const decodedToken = jwtDecode(auth);
      setIsAdmin(decodedToken.role === "ADMIN");
    }
  }, [auth]);

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
    const whatsappUrl = `https://wa.me/50684613257?text=${encodedMessage}`;

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
        body: JSON.stringify({
          propertyTitle: property.title,
          email,
          isAdding: !favorite,
        }),
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

  const handleEditModalOpen = () => setShowEditModal(true);
  const handleEditModalClose = () => setShowEditModal(false);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedProperty((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditSubmit = async () => {
    try {
      const response = await fetch("/api/properties", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the existing property");
      }

      const existingProperty = await response.json();
      const updatedProperty = {
        ...existingProperty,
        ...editedProperty,
      };

      const updateResponse = await fetch(`/api/properties`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProperty),
      });

      if (updateResponse.ok) {
        toast.success(texts[language].editSuccess);
        handleEditModalClose();
      } else {
        const errorText = await updateResponse.text();
        throw new Error(`Error updating property: ${errorText}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(texts[language].editError);
    }
  };

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

  const visibleThumbnails = items.slice(
    thumbnailStart,
    thumbnailStart + thumbnailsToShow
  );
  const thumbnails = visibleThumbnails.map((item, index) => (
    <img
      key={index + thumbnailStart}
      className={`m-2 ${
        activeIndex === index + thumbnailStart ? "selected" : ""
      }`}
      src={item.props.src}
      onClick={() => handleThumbnailClick(index + thumbnailStart)}
      style={{
        height: "100px",
        width: "100px",
        objectFit: "cover",
        cursor: "pointer",
        marginRight: "10px",
        border:
          activeIndex === index + thumbnailStart
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
            <h5 className="text-center text-muted">
              {texts[language].location} {property.location}
            </h5>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={12} md={6} className="mb-3" style={{ paddingRight: "20px" }}>
            <AliceCarousel
              ref={carouselRef}
              mouseTracking
              items={items}
              activeIndex={activeIndex}
              disableDotsControls
              onSlideChanged={(e) => setActiveIndex(e.item)}
            />
            <div
              className="d-flex justify-content-center ml-5"
              style={{ width: "100%" }}
            >
              <Button
                variant="outline-secondary"
                onClick={() =>
                  thumbnailStart > 0 && setThumbnailStart(thumbnailStart - 1)
                }
                disabled={thumbnailStart === 0}
              >
                {"<"}
              </Button>
              {thumbnails}
              <Button
                variant="outline-secondary"
                onClick={() =>
                  thumbnailStart + thumbnailsToShow < items.length &&
                  setThumbnailStart(thumbnailStart + 1)
                }
                disabled={thumbnailStart + thumbnailsToShow >= items.length}
              >
                {">"}
              </Button>
            </div>
          </Col>

          <Col xs={12} md={6} className="mb-3" style={{ paddingLeft: "50px" }}>
            <div
              className="d-flex justify-content-center pr-5"
              style={{ width: "90%" }}
            >
              <ul className="listado">
                <li>
                  <strong>{texts[language].region}</strong> {property.region} m²
                </li>
                <li>
                  <strong>{texts[language].landSize}</strong>{" "}
                  {property.landSize} m²
                </li>
                {property.salePrice ? (
                  <li>
                    <strong>{texts[language].salePrice}</strong> $
                    {property.salePrice} USD
                  </li>
                ) : (
                  <li>
                    <strong>{texts[language].rentPrice} </strong> $
                    {property.rentPrice} USD
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
            <p style={{ whiteSpace: "pre-line" }}>{property.description}</p>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col className="d-flex justify-content-between">
            {/* <Button variant="secondary" onClick={() => window.history.back()}>
              {texts[language].back}
            </Button> */}
            <div className="d-flex gap-2">
              <PropertyDeleteButton
                property={property}
                onDelete={() => window.history.back()}
              />
              <Button variant="outline-primary" onClick={handleFavorite}>
                {favorite ? <FaHeart /> : <FaRegHeart />}
                <span> </span>
                {favorite
                  ? texts[language].savedFavorites
                  : texts[language].saveFavorites}
              </Button>
              {isAdmin && (
                <Button
                  variant="outline-info"
                  onClick={() => setShowEditModal(true)}
                >
                  {texts[language].edit}
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </Container>

      <Modal
        show={showEditModal}
        onHide={handleEditModalClose}
        backdrop="static"
        keyboard={false}
        animation={false}
        enforceFocus
        style={{ zIndex: 1050 }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Property Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editTitle" className="mb-3">
              <Form.Label>{texts[language].title}</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={editedProperty.title}
                onChange={handleEditChange}
                autoFocus
              />
            </Form.Group>
            <Form.Group controlId="editLocation" className="mb-3">
              <Form.Label>{texts[language].location}</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={editedProperty.location}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group controlId="editRegion" className="mb-3">
              <Form.Label>{texts[language].region}</Form.Label>
              <Form.Control
                as="select"
                name="region"
                value={editedProperty.region}
                onChange={handleEditChange}
              >
                {regiones.map((region, index) => (
                  <option key={index} value={region}>
                    {region}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="editPropertyType" className="mb-3">
              <Form.Label>Tipo de propiedad</Form.Label>
              <Form.Control
                as="select"
                name="propertyType"
                value={editedProperty.propertyType}
                onChange={handleEditChange}
              >
                {propiedades.map((propiedad, index) => (
                  <option key={index} value={propiedad}>
                    {propiedad}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="editSalePrice" className="mb-3">
              <Form.Label>{texts[language].salePrice}</Form.Label>
              <Form.Control
                type="number"
                name="salePrice"
                value={editedProperty.salePrice || ""}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group controlId="editRentPrice" className="mb-3">
              <Form.Label>{texts[language].rentPrice}</Form.Label>
              <Form.Control
                type="number"
                name="rentPrice"
                value={editedProperty.rentPrice || ""}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group controlId="editDescription" className="mb-3">
              <Form.Label>{texts[language].description}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={editedProperty.description}
                onChange={handleEditChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PropertyInformation;
