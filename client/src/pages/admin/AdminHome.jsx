import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';

const AdminHome = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        // Check if user is admin
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        if (!isAdmin) {
          navigate('/login');
          return;
        }

        const response = await axiosInstance.get('/api/cars/getallcars');
        
        if (Array.isArray(response.data)) {
          setCars(response.data);
        } else if (Array.isArray(response.data.cars)) {
          setCars(response.data.cars);
        } else {
          setError('Unexpected response format from server');
        }
      } catch (error) {
        console.error('Failed to fetch cars:', error);
        if (error.response?.status === 403) {
          setError('Access denied. Please make sure you are logged in as an admin.');
          navigate('/login');
        } else {
          setError('Failed to fetch cars. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [navigate]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="display-4 fw-bold">Manage Cars</h1>
          <Link to="/admin/addcar" className="btn btn-primary">
            Add New Car
          </Link>
        </div>

        {cars.length === 0 ? (
          <div className="text-center py-5">
            <p className="lead">No cars found.</p>
            <Link to="/admin/addcar" className="btn btn-primary">
              Add Your First Car
            </Link>
          </div>
        ) : (
          <div className="row">
            {cars.map((car) => (
              <div key={car._id} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{car.name}</h5>
                    <p className="card-text mb-1">
                      <strong>Rent:</strong> ₹{car.rentPerHour}/hr
                    </p>
                    <p className="card-text mb-1">
                      <strong>Capacity:</strong> {car.capacity} people
                    </p>
                    <p className="card-text mb-1">
                      <strong>Fuel:</strong> {car.fuelType}
                    </p>
                    <p
                      className={`fw-bold ${
                        car.availabilityStatus === 'Available'
                          ? 'text-success'
                          : 'text-danger'
                      }`}
                    >
                      {car.availabilityStatus || 'Available'}
                    </p>

                    {car.serviceRecords?.length > 0 && (
                      <div className="mt-2">
                        <strong>Service History:</strong>
                        <ul className="small ps-3">
                          {car.serviceRecords.map((record, index) => (
                            <li key={index}>
                              {record.date}: {record.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-auto">
                      <Link
                        to={`/admin/editcar/${car._id}`}
                        className="btn btn-warning btn-sm w-100 mt-3"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminHome;
