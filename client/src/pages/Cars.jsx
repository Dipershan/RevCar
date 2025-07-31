import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import Footer from '../components/Footer';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    priceRange: 'all'
  });
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const { data } = await axios.get('/api/cars/getallcars');
      // Defensive: ensure data is an array
      setCars(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setError('Failed to load cars. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const filteredCars = cars.filter(car => {
    // Normalize type for comparison
    const carType = car.type ? car.type.toLowerCase() : '';
    const filterType = filters.type.toLowerCase();
    const matchesSearch = car.name ? car.name.toLowerCase().includes(filters.search.toLowerCase()) : true;
    const matchesType = filterType === 'all' || (carType === filterType);
    const matchesPriceRange = filters.priceRange === 'all' || 
      (filters.priceRange === 'low' && car.rentPerHour <= 1000) ||
      (filters.priceRange === 'medium' && car.rentPerHour > 1000 && car.rentPerHour <= 2000) ||
      (filters.priceRange === 'high' && car.rentPerHour > 2000);
    return matchesSearch && matchesType && matchesPriceRange;
  });

  return (
    <>
      {/* Hero Section */}
      <div className="py-5 text-center" style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white'
      }}>
        <div className="container py-5">
          <h1 className="display-4 fw-bold">Our Fleet</h1>
          <p className="lead">Choose from our wide selection of premium vehicles</p>
        </div>
      </div>

      <div className="container py-5">
        {/* Error State */}
        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}
        {/* Filters */}
        <div className="row mb-5">
          <div className="col-md-4 mb-3">
            <div className="input-group">
              <span className="input-group-text" style={{
                background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)',
                border: 'none'
              }}>
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search cars..."
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <select
              className="form-select"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="all">All Types</option>
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <select
              className="form-select"
              name="priceRange"
              value={filters.priceRange}
              onChange={handleFilterChange}
            >
              <option value="all">All Prices</option>
              <option value="low">₹1000 and below</option>
              <option value="medium">₹1001 - ₹2000</option>
              <option value="high">Above ₹2000</option>
            </select>
          </div>
        </div>

        {/* Car Listings */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{
              color: '#1e3c72'
            }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {filteredCars.map((car) => (
              <div key={car._id || car.id || Math.random()} className="col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm hover-lift">
                  <div className="position-relative">
                    <img
                      src={car.image && car.image.trim() !== '' ? car.image : 'https://via.placeholder.com/300x200?text=Car+Image'}
                      className="card-img-top"
                      alt={car.name || 'Car Image'}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="position-absolute top-0 end-0 p-3">
                      <span className={`badge ${
                        car.availabilityStatus === 'Available' ? 'bg-success' :
                        car.availabilityStatus === 'In Service' ? 'bg-warning' :
                        'bg-danger'
                      }`}>
                        {car.availabilityStatus || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="card-title mb-0">{car.name || 'Unnamed Car'}</h5>
                      <span className="badge" style={{
                        background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)',
                        color: '#000'
                      }}>₹{car.rentPerHour !== undefined ? car.rentPerHour : '--'}/hr</span>
                    </div>
                    <div className="mb-3">
                      <small className="text-muted">
                        <i className="bi bi-fuel-pump me-2"></i>{car.fuelType || 'N/A'}
                        <i className="bi bi-people ms-3 me-2"></i>{car.capacity !== undefined ? car.capacity : '--'} Seats
                      </small>
                    </div>
                    <button
                      onClick={() => navigate(`/booking/${car._id || car.id}`)}
                      className="btn w-100"
                      style={{
                        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                        color: 'white',
                        border: 'none'
                      }}
                      disabled={!car._id && !car.id}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredCars.length === 0 && (
          <div className="text-center py-5">
            <i className="bi bi-emoji-frown display-1 text-muted"></i>
            <h3 className="mt-3">No cars found</h3>
            <p className="text-muted">Try adjusting your filters</p>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Cars; 