import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useLanguage } from '../app/LanguageContext';

const PropertySearch = () => {
  const { language } = useLanguage(); 
  const [propertyType, setPropertyType] = useState('Todos');
  const [region, setRegion] = useState('Todos');
  const [minSize, setMinSize] = useState('1');
  const [maxSize, setMaxSize] = useState('99999');
  const [minPrice, setMinPrice] = useState('1');
  const [maxPrice, setMaxPrice] = useState('99999');
  const [purpose, setPurpose] = useState('Comprar');

  const texts = {
    es: {
      title: 'Buscar propiedades',
      propertyType: '¿Qué tipo de propiedad buscas?',
      region: '¿En qué región de Costa Rica?',
      sizeRange: 'Danos un rango de tamaño para el terreno (en m²)',
      priceRange: 'Danos un rango de precio (en USD)',
      searchingFor: 'Estás buscando',
      searchButton: 'Buscar',
      buy: 'Comprar',
      rent: 'Alquilar',
    },
    en: {
      title: 'Search Properties',
      propertyType: 'What type of property are you looking for?',
      region: 'In which region of Costa Rica?',
      sizeRange: 'Give us a size range for the land (in m²)',
      priceRange: 'Give us a price range (in USD)',
      searchingFor: 'You are looking for',
      searchButton: 'Search',
      buy: 'Buy',
      rent: 'Rent',
    },
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching with selected criteria');
  };

  return (
    <Container className="pt-5 mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="text-center mb-4">{texts[language].title}</h2>
      <Form onSubmit={handleSearch}>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={6}>{texts[language].propertyType}</Form.Label>
          <Col sm={6}>
            <Form.Select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
              <option>Todos</option>
              {/* Agregar más opciones según sea necesario */}
            </Form.Select>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={6}>{texts[language].region}</Form.Label>
          <Col sm={6}>
            <Form.Select value={region} onChange={(e) => setRegion(e.target.value)}>
              <option>Todos</option>
              {/* Agregar más opciones de regiones */}
            </Form.Select>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={6}>{texts[language].sizeRange}</Form.Label>
          <Col sm={3}>
            <Form.Control type="number" value={minSize} onChange={(e) => setMinSize(e.target.value)} />
          </Col>
          <Col sm={3}>
            <Form.Control type="number" value={maxSize} onChange={(e) => setMaxSize(e.target.value)} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={6}>{texts[language].priceRange}</Form.Label>
          <Col sm={3}>
            <Form.Control type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          </Col>
          <Col sm={3}>
            <Form.Control type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={6}>{texts[language].searchingFor}</Form.Label>
          <Col sm={6}>
            <Form.Check
              inline
              type="radio"
              label={texts[language].buy} 
              name="purpose"
              id="buy"
              checked={purpose === 'Comprar'}
              onChange={() => setPurpose('Comprar')}
            />
            <Form.Check
              inline
              type="radio"
              label={texts[language].rent} 
              name="purpose"
              id="rent"
              checked={purpose === 'Alquilar'}
              onChange={() => setPurpose('Alquilar')}
            />
          </Col>
        </Form.Group>

        <div className="d-flex justify-content-center mt-5">
          <Button variant="primary" type="submit">
            {texts[language].searchButton}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default PropertySearch;