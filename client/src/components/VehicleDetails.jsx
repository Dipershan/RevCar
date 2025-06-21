import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  ListGroup,
  Carousel
} from 'react-bootstrap';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [booking, setBooking] = useState({
    startDate: '',
    endDate: '',
    pickupLocation: '',
    dropoffLocation: '',
    additionalServices: []
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [totalCost, setTotalCost] = useState(0);

  const fetchVehicleDetails = useCallback(async () => {
    try {
      const response = await axios.get(`/api/vehicles/${id}`);
      setVehicle(response.data);
    } catch (error) {
      setError('Error fetching vehicle details');
      console.error('Error:', error);
    }
  }, [id]);

  const calculateTotalCost = useCallback(() => {
    if (!vehicle || !booking.startDate || !booking.endDate) return;

    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    let total = days * vehicle.pricePerDay;

    // Add costs for additional services
    booking.additionalServices.forEach(service => {
      switch (service) {
        case 'insurance':
          total += days * 15;
          break;
        case 'gps':
          total += days * 5;
          break;
        case 'childSeat':
          total += days * 10;
          break;
        case 'additionalDriver':
          total += days * 20;
          break;
        default:
          break;
      }
    });

    setTotalCost(total);
  }, [booking, vehicle]);

  useEffect(() => {
    fetchVehicleDetails();
  }, [fetchVehicleDetails]);

  useEffect(() => {
    calculateTotalCost();
  }, [calculateTotalCost]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setBooking(prev => ({
        ...prev,
        additionalServices: checked
          ? [...prev.additionalServices, value]
          : prev.additionalServices.filter(service => service !== value)
      }));
    } else {
      setBooking(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('/api/bookings', {
        vehicleId: id,
        ...booking
      });

      setSuccess('Booking created successfully!');
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating booking');
    }
  };

  if (!vehicle) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container className="my-4">
      <Row>
        <Col md={7}>
          <Card>
            <Carousel>
              {vehicle.images.map((image, index) => (
                <Carousel.Item key={index}>
                  <img
                    className="d-block w-100"
                    src={image}
                    alt={`${vehicle.make} ${vehicle.model} - View ${index + 1}`}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
            <Card.Body>
              <Card.Title>{`${vehicle.make} ${vehicle.model} (${vehicle.year})`}</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Type:</strong> {vehicle.vehicleType}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Transmission:</strong> {vehicle.transmission}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Fuel Type:</strong> {vehicle.fuelType}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Capacity:</strong> {vehicle.capacity} passengers
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Price:</strong> ${vehicle.pricePerDay}/day
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Features:</strong>
                  <ul>
                    {vehicle.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card>
            <Card.Body>
              <Card.Title>Book This Vehicle</Card.Title>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={booking.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={booking.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Pickup Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="pickupLocation"
                    value={booking.pickupLocation}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Drop-off Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="dropoffLocation"
                    value={booking.dropoffLocation}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Additional Services</Form.Label>
                  {['insurance', 'gps', 'childSeat', 'additionalDriver'].map((service) => (
                    <Form.Check
                      key={service}
                      type="checkbox"
                      label={service.charAt(0).toUpperCase() + service.slice(1)}
                      value={service}
                      checked={booking.additionalServices.includes(service)}
                      onChange={handleInputChange}
                    />
                  ))}
                </Form.Group>

                <Alert variant="info">
                  <strong>Total Cost: ${totalCost}</strong>
                </Alert>

                <Button variant="primary" type="submit" className="w-100">
                  Book Now
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VehicleDetails; 