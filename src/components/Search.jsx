import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, ToastContainer } from 'react-bootstrap';
import { useLanguage } from '../app/LanguageContext';

const PropertySearch = ({ toPropertyResults }) => {
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
      both: 'Ambos'
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
      both: 'Both'
    },
  };

  const propiedades = ["Todos",
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
    "Todos",
    "Guanacaste | Pacífico Norte",
    "Limón | Caribe",
    "Pérez Zeledón",
    "Puntarenas | Pacífico sur",
    "Valle Central",
    "Zona Norte",
    "Zona Pacífico Sur"
  ];

  // Función para formatear los números con comas
  const formatNumberWithCommas = (value) => {
    const numberWithoutCommas = value.replace(/,/g, ''); // Remover comas anteriores
    return numberWithoutCommas.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Agregar comas
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const filters = {
      propertyType,
      region,
      minSize: parseInt(minSize.replace(/,/g, '')),
      maxSize: parseInt(maxSize.replace(/,/g, '')),
      minPrice: parseInt(minPrice.replace(/,/g, '')),
      maxPrice: parseInt(maxPrice.replace(/,/g, '')),
      purpose
    }

    try {
      const response = await fetch('/api/getProperties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({filters}),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const properties = await response.json();

      toPropertyResults(properties);

    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
    <ToastContainer/>
    <Container className="pt-5 mt-5" style={{ maxWidth: '650px' }}>
      <h2 className="text-center mb-4">{texts[language].title}</h2>
      <Form onSubmit={handleSearch}>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={6}>{texts[language].propertyType}</Form.Label>
          <Col sm={6}>
            <Form.Select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
              {
                propiedades.map((propiedad) =>
                  (<option key={propiedad}>{propiedad}</option>)
                )
              }
            </Form.Select>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={6}>{texts[language].region}</Form.Label>
          <Col sm={6}>
            <Form.Select value={region} onChange={(e) => setRegion(e.target.value)}>
              {
                regiones.map((region) => 
                  (<option key={region}>{region}</option>)
                )
              }
            </Form.Select>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={6}>{texts[language].sizeRange}</Form.Label>
          <Col sm={3}>
            <Form.Control 
              type="text" // Cambiamos a tipo texto para formatear con comas
              value={minSize}
              onChange={(e) => setMinSize(formatNumberWithCommas(e.target.value))} 
            />
          </Col>
          <Col sm={3}>
            <Form.Control 
              type="text" // Cambiamos a tipo texto para formatear con comas
              value={maxSize}
              onChange={(e) => setMaxSize(formatNumberWithCommas(e.target.value))} 
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={6}>{texts[language].priceRange}</Form.Label>
          <Col sm={3}>
            <Form.Control 
              type="text" // Cambiamos a tipo texto para formatear con comas
              value={minPrice}
              onChange={(e) => setMinPrice(formatNumberWithCommas(e.target.value))} 
            />
          </Col>
          <Col sm={3}>
            <Form.Control 
              type="text" // Cambiamos a tipo texto para formatear con comas
              value={maxPrice}
              onChange={(e) => setMaxPrice(formatNumberWithCommas(e.target.value))} 
            />
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
            <Form.Check
              inline
              type="radio"
              label={texts[language].both} 
              name="purpose"
              id="rent"
              checked={purpose === 'Ambos'}
              onChange={() => setPurpose('Ambos')}
            />
          </Col>
        </Form.Group>

        <div className="d-flex justify-content-center mt-5" style={{paddingBottom: 20}}>
          <Button variant="primary" type="submit">
            {texts[language].searchButton}
          </Button>
        </div>
      </Form>
    </Container>
    </>
  );
};

export default PropertySearch;
