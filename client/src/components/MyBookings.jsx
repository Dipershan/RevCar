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
      setBookings(response.data.bookings);
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

      {Array.isArray(bookings) && bookings.length === 0 ? (
        <Alert variant="info">No bookings found</Alert>
      ) : Array.isArray(bookings) ? (
        <Row xs={1} md={2} className="g-4">
          {bookings.map((booking) => (
            <Col key={booking._id}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {booking.car?.name || "Unknown Car"}
                    <Badge
                      bg={getStatusBadgeVariant(booking.status)}
                      className="ms-2"
                    >
                      {booking.status}
                    </Badge>
                  </Card.Title>
                  <Card.Text>
                    <strong>From:</strong> {new Date(booking.bookedTimeSlots?.from).toLocaleDateString()} -{' '}
                    {new Date(booking.bookedTimeSlots?.to).toLocaleDateString()}
                    <br />
                    <strong>Total Hours:</strong> {booking.totalHours}
                    <br />
                    <strong>Total Amount:</strong> ₹{booking.totalAmount}
                    <br />
                    <strong>Driver Required:</strong> {booking.driverRequired ? "Yes" : "No"}
                    <br />
                    {booking.car?.image && (
                      <img
                        src={booking.car.image}
                        alt={booking.car.name}
                        className="img-fluid mt-2"
                        style={{ height: '150px', objectFit: 'cover' }}
                      />
                    )}
                  </Card.Text>
                  {booking.status !== 'cancelled' && (
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
      ) : (
        <Alert variant="danger">Invalid bookings data.</Alert>
      )}
    </Container>
  );
};

export default MyBookings; 