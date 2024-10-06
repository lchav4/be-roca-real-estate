import React, { useState } from "react";
import { Container, Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";

const NewPropertyForm = () => {
  const [images, setImages] = useState([]); // Nueva variable de estado para la imagen
  const [imagePreviews, setImagePreviews] = useState([]); // Nueva variable de estado para la vista previa de la imagen
  const [formData, setFormData] = useState({
    province: "",
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

  const handleImageChange = async (e) => {
    e.preventDefault();
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]); // Guardar la imagen seleccionada

    const filePreviews = files.map((file) => URL.createObjectURL(file)); // Crear vista previa de la imagen
    setImagePreviews((prevPreviews) => [...prevPreviews, ...filePreviews]); // Guardar la vista previa de la imagen
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
      const formDataObj = new FormData(); // Usamos FormData para enviar archivos
      Object.keys(formData).forEach((key) => {
        formDataObj.append(key, formData[key]);
      });

      images.forEach((image, index) => {
        formDataObj.append(`image[${index}]`, image); // Agregar cada imagen al FormData
      });

          // Verificar el contenido de formDataObj
    for (let pair of formDataObj.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await fetch("/api/properties", {
        method: "POST",
        body: formDataObj
      });

      const data = await response.json();
      if (response.status === 200) {
        toast.success("Propiedad anunciada con éxito");
      } else {
        throw new Error(data.error);
      }

      setFormData({
        province: "",
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
      setImages([]); // Restablecer imagen
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <Container className="my-4">
        <h2 className="text-center mb-4">Nuevo Anuncio</h2>
        <Form onSubmit={handleSubmit}>
          <h4>Ubicación</h4>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formProvince">
                <Form.Label>Provincia:</Form.Label>
                <Form.Select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="San José">San José</option>
                  <option value="Alajuela">Alajuela</option>
                  <option value="Cartago">Cartago</option>
                  <option value="Guanacaste">Guanacaste</option>
                  <option value="Heredia">Heredia</option>
                  <option value="Puntarenas">Puntarenas</option>
                  <option value="Limón">Limón</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formRegion">
                <Form.Label>Región:</Form.Label>
                <Form.Control
                  type="text"
                  name="region"
                  placeholder="Escriba la región"
                  value={formData.region}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="formLocation" className="mb-3">
            <Form.Label>Localización:</Form.Label>
            <Form.Control
              type="text"
              name="location"
              placeholder="Dirección"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <h4>Características</h4>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formPropertyType">
                <Form.Label>Tipo de propiedad:</Form.Label>
                <Form.Select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="house">Casa</option>
                  <option value="apartment">Apartamento</option>
                  <option value="land">Terreno</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formLandSize">
                <Form.Label>Tamaño del terreno (m²):</Form.Label>
                <Form.Control
                  type="number"
                  name="landSize"
                  placeholder="Tamaño en m²"
                  value={formData.landSize}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="formTitle" className="mb-3">
            <Form.Label>Título Breve:</Form.Label>
            <Form.Control
              type="text"
              name="title"
              placeholder="Título Breve"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formDescription" className="mb-3">
            <Form.Label>Descripción:</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              placeholder="Ingrese una descripción de la propiedad"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </Form.Group>

          <h4>Precio</h4>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formSalePrice">
                <Form.Label>Precio de venta:</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    name="salePrice"
                    placeholder="USD"
                    value={formData.salePrice}
                    onChange={handleChange}
                    disabled={!formData.forSale}
                  />
                  <InputGroup.Checkbox
                    name="forSale"
                    checked={formData.forSale}
                    onChange={handleChange}
                  />
                  <Form.Label className="ms-2">
                    ¿Ofrece la propiedad para la venta?
                  </Form.Label>
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formRentPrice">
                <Form.Label>Alquiler mensual:</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    name="rentPrice"
                    placeholder="USD"
                    value={formData.rentPrice}
                    onChange={handleChange}
                    disabled={!formData.forRent}
                  />
                  <InputGroup.Checkbox
                    name="forRent"
                    checked={formData.forRent}
                    onChange={handleChange}
                  />
                  <Form.Label className="ms-2">
                    ¿Ofrece la propiedad para alquiler a largo plazo?
                  </Form.Label>
                </InputGroup>
              </Form.Group>
            </Col>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Imagen de la propiedad</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={(e) => {
                  handleImageChange(e);
                }}
              />
              <div className="image-previews">
                {imagePreviews.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Preview ${index}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      margin: "5px",
                    }}
                  />
                ))}
              </div>
            </Form.Group>
          </Row>

          <Button variant="primary" type="submit" className="w-100 mb-4">
            Publicar
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default NewPropertyForm;
