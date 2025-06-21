import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import {
  Container,
  Card,
  Button,
  Badge,
  Row,
  Col,
  Alert
} from 'react-bootstrap';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/bookings/my-bookings');
      setBookings(response.data);
    } catch (error) {
      setError('Error fetching bookings');
      console.error('Error:', error);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.post(`/api/bookings/${bookingId}/cancel`);
      fetchBookings(); // Refresh bookings list
    } catch (error) {
      setError('Error cancelling booking');
      console.error('Error:', error);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'success';
      case 'ongoing':
        return 'primary';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4">My Bookings</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {bookings.length === 0 ? (
        <Alert variant="info">No bookings found</Alert>
      ) : (
        <Row xs={1} md={2} className="g-4">
          {bookings.map((booking) => (
            <Col key={booking._id}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {booking.vehicle.make} {booking.vehicle.model}
                    <Badge
                      bg={getStatusBadgeVariant(booking.status)}
                      className="ms-2"
                    >
                      {booking.status}
                    </Badge>
                  </Card.Title>
                  <Card.Text>
                    <strong>Dates:</strong>
                    <br />
                    {new Date(booking.startDate).toLocaleDateString()} -{' '}
                    {new Date(booking.endDate).toLocaleDateString()}
                    <br />
                    <strong>Pickup:</strong> {booking.pickupLocation}
                    <br />
                    <strong>Drop-off:</strong> {booking.dropoffLocation}
                    <br />
                    <strong>Total Cost:</strong> ${booking.totalCost}
                    <br />
                    {booking.additionalServices?.length > 0 && (
                      <>
                        <strong>Additional Services:</strong>
                        <ul>
                          {booking.additionalServices.map((service) => (
                            <li key={service}>
                              {service.charAt(0).toUpperCase() + service.slice(1)}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </Card.Text>
                  {(booking.status === 'pending' || booking.status === 'confirmed') && (
                    <Button
                      variant="danger"
                      onClick={() => handleCancelBooking(booking._id)}
                    >
                      Cancel Booking
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyBookings; 