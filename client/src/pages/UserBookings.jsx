import { useEffect, useState } from "react";
import axios from "../api/axiosInstance"; 
import Header from "../components/Header"; 
import Footer from "../components/Footer"; 

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('/api/bookings/user');
        console.log('Bookings response:', res.data);
        if (res.data.success && Array.isArray(res.data.bookings)) {
          setBookings(res.data.bookings);
        } else {
          setError('Invalid response format from server');
        }
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
        setError('Failed to fetch your bookings. Please try again later.');
      } finally {
        setLoading(false); 
      }
    };
    fetchBookings();
  }, []);

  const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  return (
    <>
      <Header />

      <div className="container my-5">
        <h1 className="text-center mb-4">📄 My Bookings</h1>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : Array.isArray(bookings) && bookings.length === 0 ? (
          <div className="text-center">
            <p className="text-muted">No bookings found.</p>
          </div>
        ) : Array.isArray(bookings) ? (
          <div className="row">
            {bookings.map((booking) => (
              <div key={booking._id} className="col-md-6 mb-4">
                <div className="card h-100 shadow-sm">
                  {booking.car?.image && (
                    <img
                      src={booking.car.image}
                      alt={booking.car.name}
                      className="card-img-top"
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{booking.car?.name || "Unknown Car"}</h5>
                    <div className="card-text">
                      <p className="mb-1">
                        <strong>From:</strong> {formatDateTime(booking.bookedTimeSlots.from)}
                      </p>
                      <p className="mb-1">
                        <strong>To:</strong> {formatDateTime(booking.bookedTimeSlots.to)}
                      </p>
                      <p className="mb-1">
                        <strong>Total Hours:</strong> {booking.totalHours}
                      </p>
                      <p className="mb-1">
                        <strong>Total Amount:</strong> ₹{booking.totalAmount}
                      </p>
                      <p className="mb-1">
                        <strong>Driver Required:</strong> {booking.driverRequired ? "Yes" : "No"}
                      </p>
                      <p className="mb-0">
                        <strong>Status:</strong>{" "}
                        <span className={`badge ${
                          booking.status === "Confirmed"
                            ? "bg-success"
                            : booking.status === "Cancelled"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                        }`}>
                          {booking.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-danger" role="alert">
            Invalid bookings data.
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default UserBookings;
