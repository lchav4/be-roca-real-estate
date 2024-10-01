import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';


const PropertySearch = () => {
  const [propertyType, setPropertyType] = useState('Todos');
  const [region, setRegion] = useState('Todos');
  const [minSize, setMinSize] = useState('1');
  const [maxSize, setMaxSize] = useState('99999');
  const [minPrice, setMinPrice] = useState('1');
  const [maxPrice, setMaxPrice] = useState('99999');
  const [purpose, setPurpose] = useState('Comprar');


  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Realizando búsqueda con los criterios seleccionados');
  };


  return (
    <Container className="pt-5 mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="text-center mb-4">Buscar propiedades</h2>
      <Form onSubmit={handleSearch}>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={6}>¿Qué tipo de propiedad buscas?</Form.Label>
          <Col sm={6}>
            <Form.Select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
              <option>Todos</option>
              {/* Agregar más opciones según sea necesario */}
            </Form.Select>
          </Col>
        </Form.Group>


        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={6}>¿En qué región de Costa Rica?</Form.Label>
          <Col sm={6}>
            <Form.Select value={region} onChange={(e) => setRegion(e.target.value)}>
              <option>Todos</option>
              {/* Agregar más opciones de regiones */}
            </Form.Select>
          </Col>
        </Form.Group>


        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={6}>Danos un rango de tamaño para el terreno (en m²)</Form.Label>
          <Col sm={3}>
            <Form.Control type="number" value={minSize} onChange={(e) => setMinSize(e.target.value)} />
          </Col>
          <Col sm={3}>
            <Form.Control type="number" value={maxSize} onChange={(e) => setMaxSize(e.target.value)} />
          </Col>
        </Form.Group>


        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={6}>Danos un rango de precio (en USD)</Form.Label>
          <Col sm={3}>
            <Form.Control type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          </Col>
          <Col sm={3}>
            <Form.Control type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
          </Col>
        </Form.Group>


        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={6}>Estás buscando</Form.Label>
          <Col sm={6}>
            <Form.Check
              inline
              type="radio"
              label="Comprar"
              name="purpose"
              id="buy"
              checked={purpose === 'Comprar'}
              onChange={() => setPurpose('Comprar')}
            />
            <Form.Check
              inline
              type="radio"
              label="Alquilar"
              name="purpose"
              id="rent"
              checked={purpose === 'Alquilar'}
              onChange={() => setPurpose('Alquilar')}
            />
          </Col>
        </Form.Group>


        <div className="d-flex justify-content-center mt-5">
          <Button variant="primary" type="submit">
            Buscar
          </Button>
        </div>
      </Form>
    </Container>
  );
};


export default PropertySearch;
