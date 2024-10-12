import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';

const PropertyResults = ({ properties, onNavigate }) => { 
  if (properties.length === 0) {
    return <p>No se encontraron propiedades que coincidan con los criterios de búsqueda.</p>;
  }

  const handleMoreInfo = (property) => {
    onNavigate('propertyInformation', property); 
  };

  return (
    <Row className="justify-content-center" style={{ marginBottom: "50px", marginTop: "30px", marginLeft: "20px", marginRight: "20px" }}>
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
                      <strong>Region: {property.region}</strong><br />
                      <strong>Ubicación:</strong> {property.location}<br />
                      <strong>Tipo:</strong> {property.propertyType}<br />
                    </Card.Text>
                    <Button 
                      variant="primary" 
                      style={{ marginTop: 'auto' }}
                      onClick={() => handleMoreInfo(property)} 
                    >
                      Más Información
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
