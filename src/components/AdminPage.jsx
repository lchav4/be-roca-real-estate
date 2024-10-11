import React, { useState } from "react";
import { Container, Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { useLanguage } from "../app/LanguageContext"; 

const NewPropertyForm = () => {
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
    region: "",
    location: "",
    propertyType: "",
    landSize: "",
    title: "",
    description: "",
    salePrice: "",
    rentPrice: "",
    forSale: false,
    forRent: false,
  });

  const { language } = useLanguage(); 

  const texts = {
    es: {
      newAd: "Nuevo Anuncio",
      location: "Ubicación",
      region: "Región",
      locationField: "Localización",
      propertyType: "Tipo de propiedad",
      landSize: "Tamaño del terreno (m²)",
      title: "Título Breve",
      description: "Descripción",
      salePrice: "Precio de venta",
      rentPrice: "Alquiler mensual",
      forSale: "¿Ofrece la propiedad para la venta?",
      forRent: "¿Ofrece la propiedad para alquiler a largo plazo?",
      propertyImage: "Imagen de la propiedad",
      publish: "Publicar",
    },
    en: {
      newAd: "New Ad",
      location: "Location",
      region: "Region",
      locationField: "Address",
      propertyType: "Property Type",
      landSize: "Land Size (m²)",
      title: "Short Title",
      description: "Description",
      salePrice: "Sale Price",
      rentPrice: "Monthly Rent",
      forSale: "Is the property for sale?",
      forRent: "Is the property for rent?",
      propertyImage: "Property Image",
      publish: "Publish",
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
    "Terrenos | Lotes"
  ];

  const regiones = [
    "Guanacaste | Pacífico Norte",
    "Limón | Caribe",
    "Pérez Zeledón",
    "Puntarenas | Pacífico sur",
    "Valle Central",
    "Zona Norte",
    "Zona Pacífico Sur"
  ];

  const handleImageChange = async (e) => {
    e.preventDefault();
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);

    const filePreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...filePreviews]);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataObj = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataObj.append(key, formData[key]);
      });

      images.forEach((image, index) => {
        formDataObj.append(`image[${index}]`, image);
      });

      console.log("formDataObj", formDataObj);

      const response = await fetch("/api/properties", {
        method: "POST",
        body: formDataObj,
      });

      const data = await response.json();
      if (response.status === 200) {
        toast.success("Propiedad anunciada con éxito");
      } else {
        throw new Error(data.error);
      }

      setFormData({
        region: "",
        location: "",
        propertyType: "",
        landSize: "",
        title: "",
        description: "",
        salePrice: "",
        rentPrice: "",
        forSale: false,
        forRent: false,
      });
      setImages([]);
      setImagePreviews([]);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <Container className="my-4">
        <h2 className="text-center mb-4">{texts[language].newAd}</h2>
        <Form onSubmit={handleSubmit}>
          <h4>{texts[language].location}</h4>
          <Row className="mb-3">

              <Form.Group controlId="formRegion">
                <Form.Label>{texts[language].region}:</Form.Label>
                <Form.Select
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  required
                >
                  <option value="">{texts[language].select}</option>
                  {regiones.map((region, index) => (
                    <option key={index} value={region}>{region}</option>
                  ))}
                </Form.Select>
              </Form.Group>

          </Row>

          <Form.Group controlId="formLocation" className="mb-3">
            <Form.Label>{texts[language].locationField}:</Form.Label>
            <Form.Control
              type="text"
              name="location"
              placeholder={texts[language].locationField}
              value={formData.location}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <h4>{texts[language].propertyType}</h4>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formPropertyType">
                <Form.Label>{texts[language].propertyType}:</Form.Label>
                <Form.Select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  required
                >
                  <option value="">{texts[language].select}</option>
                  {propiedades.map((propiedad, index) => (
                    <option key={index} value={propiedad}>{propiedad}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formLandSize">
                <Form.Label>{texts[language].landSize}:</Form.Label>
                <Form.Control
                  type="text" // Cambiado a texto para formatear con comas
                  name="landSize"
                  placeholder={texts[language].landSize}
                  value={formData.landSize}
                  onChange={(e) => {
                    setFormData({ ...formData, landSize: e.target.value });
                  }}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="formTitle" className="mb-3">
            <Form.Label>{texts[language].title}:</Form.Label>
            <Form.Control
              type="text"
              name="title"
              placeholder={texts[language].title}
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formDescription" className="mb-3">
            <Form.Label>{texts[language].description}:</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              placeholder={texts[language].description}
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </Form.Group>

          <h4>{texts[language].salePrice}</h4>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formSalePrice">
                <Form.Label>{texts[language].salePrice}:</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text" // Cambiado a texto para formatear con comas
                    name="salePrice"
                    placeholder="USD"
                    value={formData.salePrice}
                    onChange={(e) => {
                      setFormData({ ...formData, salePrice: e.target.value });
                    }}
                    disabled={!formData.forSale}
                  />
                  <InputGroup.Checkbox
                    name="forSale"
                    checked={formData.forSale}
                    onChange={handleChange}
                  />
                  <Form.Label className="ms-2">
                    {texts[language].forSale}
                  </Form.Label>
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formRentPrice">
                <Form.Label>{texts[language].rentPrice}:</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text" // Cambiado a texto para formatear con comas
                    name="rentPrice"
                    placeholder="USD"
                    value={formData.rentPrice}
                    onChange={(e) => {
                      setFormData({ ...formData, rentPrice: e.target.value });
                    }}
                    disabled={!formData.forRent}
                  />
                  <InputGroup.Checkbox
                    name="forRent"
                    checked={formData.forRent}
                    onChange={handleChange}
                  />
                  <Form.Label className="ms-2">
                    {texts[language].forRent}
                  </Form.Label>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="formPropertyImage" className="mb-3">
            <Form.Label>{texts[language].propertyImage}:</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            <div className="mt-3">
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`preview-${index}`}
                  className="img-thumbnail"
                  style={{ width: "150px", marginRight: "10px" }}
                />
              ))}
            </div>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mb-4">
            {texts[language].publish}
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default NewPropertyForm;
