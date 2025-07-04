import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import CarCard from '../components/CarCard';
import SOSButton from '../components/SOSButton';
import { isAuthenticated } from '../utils/auth';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const featuredCars = [
  {
    id: 1,
    name: 'Toyota Corolla',
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/139139/harrier-facelift-exterior-right-front-three-quarter-5.jpeg?isig=0&q=80',
    price: 50,
    type: 'Sedan',
  },
  {
    id: 2,
    name: 'Honda Civic',
    image: 'https://mfcwl-vehicle-live-web-images.s3.us-west-2.amazonaws.com/live_web_images/usedcarsimg/mfc/4235/517617/cover_image-20220625190355.jpeg',
    price: 60,
    type: 'Sedan',
  },
  {
    id: 3,
    name: 'Ford Endeavour',
    image: 'https://imgd.aeplcdn.com/1920x1080/n/cw/ec/37640/endeavour-exterior-right-front-three-quarter-149471.jpeg?q=80&q=80',
    price: 80,
    type: 'SUV',
  },
];

const Home = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchParams, setSearchParams] = useState({
    pickupLocation: '',
    dropLocation: '',
    pickupDate: '',
    dropDate: ''
  });
  const navigate = useNavigate();
  const [blogs] = useState([
    {
      id: 1,
      title: "10 Tips for a Safe and Comfortable Road Trip",
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
      category: "Travel Tips"
    },
    {
      id: 2,
      title: "Why Electric Cars Are the Future",
      image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7",
      category: "Industry News"
    },
    {
      id: 3,
      title: "Best Scenic Drives in Nepal",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa",
      category: "Destinations"
    }
  ]);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = isAuthenticated();
      if (!auth) {
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate form
      if (!searchParams.pickupLocation || !searchParams.dropLocation || 
          !searchParams.pickupDate || !searchParams.dropDate) {
        alert('Please fill in all fields');
        return;
      }

      const { data } = await axios.get('/api/cars/getallcars');
      // Filter cars based on location
      const filteredCars = data.filter(car => 
        car.availabilityStatus === 'Available' &&
        car.location?.toLowerCase().includes(searchParams.pickupLocation.toLowerCase())
      );
      
      setCars(filteredCars);
      setShowResults(true);
    } catch (error) {
      console.error('Error fetching cars:', error);
      alert('Error fetching available cars. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (car) => {
    navigate(`/booking/${car._id}`);
  };

  return (
    <>
      {/* Hero Section */}
      <div className="py-5 text-center text-white" style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%), url(https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1920&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Container>
          <h1 className="display-3 fw-bold mb-3">Welcome to RevCar</h1>
          <p className="lead mb-4">Find and book your perfect ride in just a few clicks!</p>
          <Button as={Link} to="/cars" size="lg" variant="light" className="fw-bold shadow">Browse Cars</Button>
        </Container>
      </div>

      {/* Featured Cars Section */}
      <Container className="my-5">
        <h2 className="text-center mb-4">Featured Cars</h2>
        <Row className="g-4">
          {featuredCars.map(car => (
            <Col key={car.id} md={4}>
              <Card className="h-100 shadow-sm">
                <Card.Img variant="top" src={car.image} style={{ height: '200px', objectFit: 'cover' }} />
                <Card.Body>
                  <Card.Title>{car.name}</Card.Title>
                  <Card.Text>
                    <strong>Type:</strong> {car.type}<br />
                    <strong>Price:</strong> ${car.price}/day
                  </Card.Text>
                  <Button as={Link} to="/cars" variant="primary" className="w-100">View All Cars</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Search Results */}
      {showResults && (
        <div className="container my-5">
          <h2 className="text-center mb-4">Available Cars</h2>
          {loading ? (
            <div className="text-center">
              <Loader />
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center">
              <div className="mb-4">
                <i className="bi bi-emoji-frown display-1 text-muted"></i>
              </div>
              <h3>No Cars Available</h3>
              <p className="text-muted">No cars available at the selected location. Please try a different location or date.</p>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {cars.map((car) => (
                <div key={car._id} className="col">
                  <div className="card h-100 border-0 shadow-sm hover-lift">
                    <img
                      src={car.image || 'https://via.placeholder.com/300x200?text=Car+Image'}
                      className="card-img-top"
                      alt={car.name}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="card-title mb-0">{car.name}</h5>
                        <span className="badge" style={{
                          background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)',
                          color: '#000'
                        }}>₹{car.rentPerHour}/hr</span>
                      </div>
                      <div className="mb-3">
                        <small className="text-muted">
                          <i className="bi bi-geo-alt me-2"></i>{car.location}
                          <i className="bi bi-fuel-pump ms-3 me-2"></i>{car.fuelType}
                          <i className="bi bi-people ms-3 me-2"></i>{car.capacity} Seats
                        </small>
                      </div>
                      <button
                        onClick={() => handleBookNow(car)}
                        className="btn w-100"
                        style={{
                          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                          color: 'white',
                          border: 'none'
                        }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Features Section */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #f6f9fc 0%, #fff 100%)' }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Why Choose Us
            </h2>
            <p className="lead text-muted">Experience the difference with our premium services</p>
          </div>
          
          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className="card h-100 border-0 shadow-sm hover-lift">
                <div className="card-body text-center p-4">
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)'
                  }}>
                    <i className="bi bi-car-front fs-2"></i>
                  </div>
                  <h4 className="mb-3">Premium Fleet</h4>
                  <p className="text-muted">Choose from our wide selection of luxury and comfort vehicles</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card h-100 border-0 shadow-sm hover-lift">
                <div className="card-body text-center p-4">
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)'
                  }}>
                    <i className="bi bi-shield-check fs-2"></i>
                  </div>
                  <h4 className="mb-3">Safe & Secure</h4>
                  <p className="text-muted">All vehicles are regularly maintained and sanitized</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card h-100 border-0 shadow-sm hover-lift">
                <div className="card-body text-center p-4">
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)'
                  }}>
                    <i className="bi bi-geo-alt fs-2"></i>
                  </div>
                  <h4 className="mb-3">Nationwide Service</h4>
                  <p className="text-muted">Available across major cities in Nepal</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card h-100 border-0 shadow-sm hover-lift">
                <div className="card-body text-center p-4">
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)'
                  }}>
                    <i className="bi bi-headset fs-2"></i>
                  </div>
                  <h4 className="mb-3">24/7 Support</h4>
                  <p className="text-muted">Our team is always here to help you</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Latest from Our Blog
            </h2>
            <p className="lead text-muted">Stay updated with travel tips and industry news</p>
          </div>

          <div className="row g-4">
            {blogs.map(blog => (
              <div key={blog.id} className="col-lg-4">
                <div className="card border-0 shadow-sm hover-lift h-100">
                  <img src={blog.image} className="card-img-top" alt={blog.title} style={{ height: '200px', objectFit: 'cover' }} />
                  <div className="card-body">
                    <span className="badge mb-2" style={{
                      background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)',
                      color: '#000'
                    }}>{blog.category}</span>
                    <h5 className="card-title">{blog.title}</h5>
                    <Link to="/blog" className="btn btn-link text-dark p-0">Read More →</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #f6f9fc 0%, #fff 100%)' }}>
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="display-4 fw-bold mb-4" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Get in Touch
              </h2>
              <p className="lead mb-4 text-muted">Have questions? We're here to help!</p>
              
              <div className="d-flex mb-4">
                <div className="flex-shrink-0">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{
                    width: '50px',
                    height: '50px',
                    background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)'
                  }}>
                    <i className="bi bi-geo-alt fs-4"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h5>Our Location</h5>
                  <p className="text-muted mb-0">Trade Tower, Thapathali, Kathmandu</p>
                </div>
              </div>

              <div className="d-flex mb-4">
                <div className="flex-shrink-0">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{
                    width: '50px',
                    height: '50px',
                    background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)'
                  }}>
                    <i className="bi bi-telephone fs-4"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h5>Phone Number</h5>
                  <p className="text-muted mb-0">01-5971616 / 9801101924</p>
                </div>
              </div>

              <div className="d-flex">
                <div className="flex-shrink-0">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{
                    width: '50px',
                    height: '50px',
                    background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)'
                  }}>
                    <i className="bi bi-envelope fs-4"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h5>Email Address</h5>
                  <p className="text-muted mb-0">info@revcar.com</p>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card border-0 shadow-lg">
                <div className="card-body p-5">
                  <form>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <input type="text" className="form-control" placeholder="Your Name" required />
                      </div>
                      <div className="col-md-6">
                        <input type="email" className="form-control" placeholder="Your Email" required />
                      </div>
                      <div className="col-12">
                        <input type="text" className="form-control" placeholder="Subject" required />
                      </div>
                      <div className="col-12">
                        <textarea className="form-control" rows="5" placeholder="Your Message" required></textarea>
                      </div>
                      <div className="col-12">
                        <button type="submit" className="btn btn-lg w-100 text-dark" style={{
                          background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)',
                          border: 'none'
                        }}>Send Message</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-5" style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white'
      }}>
        <div className="container py-5">
          <div className="row text-center g-4">
            <div className="col-lg-3 col-6">
              <h2 className="display-4 fw-bold mb-0">5000+</h2>
              <p className="mb-0 opacity-75">Vehicles</p>
            </div>
            <div className="col-lg-3 col-6">
              <h2 className="display-4 fw-bold mb-0">2L+</h2>
              <p className="mb-0 opacity-75">Happy Customers</p>
            </div>
            <div className="col-lg-3 col-6">
              <h2 className="display-4 fw-bold mb-0">5000+</h2>
              <p className="mb-0 opacity-75">Drivers</p>
            </div>
            <div className="col-lg-3 col-6">
              <h2 className="display-4 fw-bold mb-0">30</h2>
              <p className="mb-0 opacity-75">Years Experience</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Home;
