import React, { useState, useEffect, useCallback } from 'react';
import axios from '../api/axiosInstance';
import { Card, Button, Row, Col, Form, Container } from 'react-bootstrap';

const VehicleListing = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filters, setFilters] = useState({
    vehicleType: '',
    location: '',
    startDate: '',
    endDate: '',
    minPrice: '',
    maxPrice: '',
    transmission: ''
  });

  const fetchVehicles = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await axios.get(`/api/vehicles?${queryParams}`);
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  }, [filters]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4">Available Vehicles</h2>
      
      {/* Filters */}
      <Form className="mb-4">
        <Row>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Vehicle Type</Form.Label>
              <Form.Select
                name="vehicleType"
                value={filters.vehicleType}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="luxury">Luxury</option>
                <option value="sports">Sports</option>
                <option value="van">Van</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Enter location"
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>

      {/* Vehicle Cards */}
      <Row xs={1} md={2} lg={3} className="g-4">
        {vehicles.map((vehicle) => (
          <Col key={vehicle._id}>
            <Card>
              <Card.Img
                variant="top"
                src={vehicle.images[0] || 'placeholder-car.jpg'}
                alt={`${vehicle.make} ${vehicle.model}`}
              />
              <Card.Body>
                <Card.Title>{`${vehicle.make} ${vehicle.model} (${vehicle.year})`}</Card.Title>
                <Card.Text>
                  <strong>Type:</strong> {vehicle.vehicleType}<br />
                  <strong>Transmission:</strong> {vehicle.transmission}<br />
                  <strong>Location:</strong> {vehicle.location}<br />
                  <strong>Price:</strong> ${vehicle.pricePerDay}/day
                </Card.Text>
                <Button
                  variant="primary"
                  href={`/vehicles/${vehicle._id}`}
                >
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default VehicleListing; 