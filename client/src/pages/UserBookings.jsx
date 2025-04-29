import { useEffect, useState } from "react";
import axios from "../api/axiosInstance"; 
import Header from "../components/Header"; 
import Footer from "../components/Footer"; 

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true); // <-- Added loading state

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('/api/bookings/user');
        setBookings(res.data.bookings || []);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false); // <-- Always set loading false
      }
    };
    fetchBookings();
  }, []);

  return (
    <>
      <Header />

      <div className="container my-5">
        <h1 className="text-center mb-4">📄 My Bookings</h1>

        {loading ? (
          <p className="text-center">Loading your bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-center text-muted">No bookings found.</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking._id} className="card mb-3 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{booking.car?.name || "Unknown Car"}</h5>
                <p className="card-text">
                  <strong>Total Hours:</strong> {booking.totalHours}<br />
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
          ))
        )}
      </div>

      <Footer />
    </>
  );
};

export default UserBookings;
