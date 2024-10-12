import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { useLanguage } from '../app/LanguageContext';

const PropertyResults = ({ properties, onNavigate }) => {
  const { language } = useLanguage();

  const texts = {
    es: {
      noResults: 'No se encontraron propiedades.',
      moreInfo: 'Más Información',
      province: 'Provincia:',
      region: 'Región:',
      location: 'Ubicación:',
      type: 'Tipo:',
    },
    en: {
      noResults: 'No properties were found.',
      moreInfo: 'More Information',
      province: 'Province:',
      region: 'Region:',
      location: 'Location:',
      type: 'Type:',
    },
  };

  if (properties.length === 0) {
    return (
      <div style={{ textAlign: 'center', margin: '100px 0' }}>
        <p>{texts[language].noResults}</p>
      </div>
    );
  }

  const handleMoreInfo = (property) => {
    onNavigate('propertyInformation', property);
  };

  return (
    <Row className="justify-content-center">
      {properties.map((property) => {
        const imageUrl = `/uploads/${property.title}_0.jpg`;

        return (
          <Col key={property.id} md={10} lg={10} className="mb-4 d-flex justify-content-center">
            <Card style={{ border: '1px solid #ddd', borderRadius: '8px', width: '100%', display: 'flex' }}>
              <Row style={{ width: '100%' }}>
                <Col xs={12} md={4} className="d-flex justify-content-center">
                  <Card.Img 
                    variant="top" 
                    src={imageUrl} 
                    style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px', maxWidth: '300px', height: 'auto' }} 
                  />
                </Col>
                <Col xs={12} md={8}>
                  <Card.Body style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', height: '100%' }}>
                    <Card.Title style={{ marginBottom: '10px', fontSize: '1.25rem', fontWeight: 'bold' }}>
                      {property.title}
                    </Card.Title>
                    <Card.Text style={{ marginBottom: '15px', color: '#555' }}>
                      <strong>{texts[language].region} {property.region}</strong><br />
                      <strong>{texts[language].location}</strong> {property.location}<br />
                      <strong>{texts[language].type}</strong> {property.propertyType}<br />
                    </Card.Text>
                    <Button 
                      variant="primary" 
                      style={{ marginTop: 'auto' }}
                      onClick={() => handleMoreInfo(property)} 
                    >
                      {texts[language].moreInfo}
                    </Button>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default PropertyResults;
