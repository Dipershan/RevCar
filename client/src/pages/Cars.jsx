import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import Footer from '../components/Footer';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableFeatures, setAvailableFeatures] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    pickupDate: '',
    returnDate: '',
    carType: 'all',
    priceRange: 'all',
    fuelType: 'all',
    capacity: 'all',
    transmission: 'all',
    features: [],
    availabilityStatus: 'all'
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Available filter options
  const carTypes = ['SUV', 'Sedan', 'Luxury', 'Sports', 'Electric', 'Hybrid', 'Van', 'Truck'];
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];
  const transmissionTypes = ['Manual', 'Automatic', 'CVT'];
  const capacityOptions = ['2', '4', '5', '6', '7', '8+'];

  useEffect(() => {
    fetchCars();
    fetchAvailableOptions();
  }, []);

  const fetchCars = async () => {
    try {
      const { data } = await axios.get('/api/cars/getallcars');
      setCars(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setError('Failed to load cars. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableOptions = async () => {
    try {
      // Fetch available locations, types, and features
      const [locationsRes, typesRes, featuresRes] = await Promise.all([
        axios.get('/api/cars/locations'),
        axios.get('/api/cars/types'),
        axios.get('/api/cars/features')
      ]);

      setAvailableLocations(locationsRes.data.cities || []);
      setAvailableTypes(typesRes.data.types || []);
      setAvailableFeatures(featuresRes.data.features || []);
    } catch (error) {
      console.error('Error fetching available options:', error);
    }
  };

  const searchCars = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.location) params.append('location', filters.location);
      if (filters.pickupDate) params.append('pickupDate', filters.pickupDate);
      if (filters.returnDate) params.append('returnDate', filters.returnDate);
      if (filters.carType !== 'all') params.append('carType', filters.carType);
      if (filters.priceRange !== 'all') params.append('priceRange', filters.priceRange);
      if (filters.fuelType !== 'all') params.append('fuelType', filters.fuelType);
      if (filters.capacity !== 'all') params.append('capacity', filters.capacity);
      if (filters.transmission !== 'all') params.append('transmission', filters.transmission);
      if (filters.availabilityStatus !== 'all') params.append('availabilityStatus', filters.availabilityStatus);
      
      // Add features as multiple parameters
      filters.features.forEach(feature => {
        params.append('features', feature);
      });

      const { data } = await axios.get(`/api/cars/search?${params.toString()}`);
      setCars(data.cars || []);
      setError(null);
    } catch (error) {
      console.error('Error searching cars:', error);
      setError('Failed to search cars. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureToggle = (feature) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      pickupDate: '',
      returnDate: '',
      carType: 'all',
      priceRange: 'all',
      fuelType: 'all',
      capacity: 'all',
      transmission: 'all',
      features: [],
      availabilityStatus: 'all'
    });
    fetchCars(); // Reset to show all cars
  };

  const handleSearch = () => {
    searchCars();
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value !== '' && value !== 'all' && 
      (Array.isArray(value) ? value.length > 0 : true)
    ).length;
  };

  return (
    <>
      {/* Hero Section */}
      <div className="py-5 text-center" style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white'
      }}>
        <div className="container py-5">
          <h1 className="display-4 fw-bold">Find Your Perfect Ride</h1>
          <p className="lead">Search, compare, and book from our premium fleet</p>
        </div>
      </div>

      <div className="container py-5">
        {/* Error State */}
        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="card shadow-sm mb-5">
          <div className="card-body">
            {/* Basic Search */}
            <div className="row mb-4">
              <div className="col-md-6 mb-3">
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
                    placeholder="Search by car name, brand, or model..."
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="input-group">
                  <span className="input-group-text" style={{
                    background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)',
                    border: 'none'
                  }}>
                    <i className="bi bi-geo-alt"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Location (e.g., Mustang, Manang, Dolpa)"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    list="locationOptions"
                  />
                  <datalist id="locationOptions">
                    {availableLocations.map(location => (
                      <option key={location} value={location} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>

            {/* Date Selection */}
            <div className="row mb-4">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  <i className="bi bi-calendar-plus me-2"></i>
                  Pickup Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="pickupDate"
                  value={filters.pickupDate}
                  onChange={handleFilterChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  <i className="bi bi-calendar-minus me-2"></i>
                  Return Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="returnDate"
                  value={filters.returnDate}
                  onChange={handleFilterChange}
                  min={filters.pickupDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="row mb-4">
              <div className="col-12">
                <button
                  className="btn btn-primary w-100"
                  onClick={handleSearch}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Searching...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-search me-2"></i>
                      Search Cars
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Advanced Filters Toggle */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <button
                className="btn btn-outline-primary"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <i className={`bi bi-chevron-${showAdvancedFilters ? 'up' : 'down'} me-2`}></i>
                Advanced Filters
                {getActiveFiltersCount() > 0 && (
                  <span className="badge bg-primary ms-2">{getActiveFiltersCount()}</span>
                )}
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={clearFilters}
              >
                <i className="bi bi-x-circle me-2"></i>
                Clear All
              </button>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="border-top pt-4">
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <label className="form-label fw-semibold">Car Type</label>
                    <select
                      className="form-select"
                      name="carType"
                      value={filters.carType}
                      onChange={handleFilterChange}
                    >
                      <option value="all">All Types</option>
                      {availableTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label fw-semibold">Price Range</label>
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
                  <div className="col-md-3 mb-3">
                    <label className="form-label fw-semibold">Fuel Type</label>
                    <select
                      className="form-select"
                      name="fuelType"
                      value={filters.fuelType}
                      onChange={handleFilterChange}
                    >
                      <option value="all">All Fuel Types</option>
                      {fuelTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label fw-semibold">Capacity</label>
                    <select
                      className="form-select"
                      name="capacity"
                      value={filters.capacity}
                      onChange={handleFilterChange}
                    >
                      <option value="all">All Capacities</option>
                      {capacityOptions.map(cap => (
                        <option key={cap} value={cap}>{cap} Seats</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Transmission</label>
                    <select
                      className="form-select"
                      name="transmission"
                      value={filters.transmission}
                      onChange={handleFilterChange}
                    >
                      <option value="all">All Transmissions</option>
                      {transmissionTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Availability</label>
                    <select
                      className="form-select"
                      name="availabilityStatus"
                      value={filters.availabilityStatus}
                      onChange={handleFilterChange}
                    >
                      <option value="all">All Status</option>
                      <option value="Available">Available</option>
                      <option value="In Service">In Service</option>
                      <option value="Booked">Booked</option>
                    </select>
                  </div>
                </div>

                {/* Features Selection */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Features & Amenities</label>
                  <div className="row">
                    {availableFeatures.map(feature => (
                      <div key={feature} className="col-md-3 col-sm-6 mb-2">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={feature}
                            checked={filters.features.includes(feature)}
                            onChange={() => handleFeatureToggle(feature)}
                          />
                          <label className="form-check-label" htmlFor={feature}>
                            {feature}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0">
            {cars.length} car{cars.length !== 1 ? 's' : ''} found
          </h5>
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <i className="bi bi-funnel me-1"></i>
              {showAdvancedFilters ? 'Hide' : 'Show'} Filters
            </button>
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
            <p className="mt-3 text-muted">Loading available cars...</p>
          </div>
        ) : (
          <div className="row g-4">
            {cars.map((car) => (
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
                    {car.features && car.features.length > 0 && (
                      <div className="position-absolute bottom-0 start-0 p-2">
                        <span className="badge bg-info">
                          <i className="bi bi-star-fill me-1"></i>
                          Premium
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="card-title mb-0">{car.name || 'Unnamed Car'}</h5>
                      <span className="badge" style={{
                        background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)',
                        color: '#000'
                      }}>₹{car.rentPerHour !== undefined ? car.rentPerHour : '--'}/hr</span>
                    </div>
                    
                    {/* Location Info */}
                    {car.location && (
                      <div className="mb-2">
                        <small className="text-muted">
                          <i className="bi bi-geo-alt me-1"></i>
                          {car.location.city}, {car.location.state}
                        </small>
                      </div>
                    )}
                    
                    <div className="mb-3">
                      <div className="row text-muted small">
                        <div className="col-6">
                          <i className="bi bi-fuel-pump me-1"></i>
                          {car.fuelType || 'N/A'}
                        </div>
                        <div className="col-6">
                          <i className="bi bi-people me-1"></i>
                          {car.capacity !== undefined ? car.capacity : '--'} Seats
                        </div>
                        <div className="col-6">
                          <i className="bi bi-gear me-1"></i>
                          {car.transmission || 'N/A'}
                        </div>
                        <div className="col-6">
                          <i className="bi bi-tag me-1"></i>
                          {car.type || 'N/A'}
                        </div>
                      </div>
                    </div>

                    {car.features && car.features.length > 0 && (
                      <div className="mb-3">
                        <small className="text-muted">
                          <strong>Features:</strong> {car.features.slice(0, 3).join(', ')}
                          {car.features.length > 3 && '...'}
                        </small>
                      </div>
                    )}

                    <button
                      onClick={() => navigate(`/booking/${car._id || car.id}`)}
                      className="btn w-100"
                      style={{
                        background: car.availabilityStatus === 'Available' 
                          ? 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
                          : '#6c757d',
                        color: 'white',
                        border: 'none'
                      }}
                      disabled={!car._id && !car.id || car.availabilityStatus !== 'Available'}
                    >
                      {car.availabilityStatus === 'Available' ? 'Book Now' : 'Not Available'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && cars.length === 0 && (
          <div className="text-center py-5">
            <i className="bi bi-emoji-frown display-1 text-muted"></i>
            <h3 className="mt-3">No cars found</h3>
            <p className="text-muted">Try adjusting your search criteria or filters</p>
            <button
              className="btn btn-primary"
              onClick={clearFilters}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Cars; 