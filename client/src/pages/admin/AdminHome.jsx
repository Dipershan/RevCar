import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';

const AdminHome = () => {
  const [cars, setCars] = useState([]);

 useEffect(() => {
  const fetchCars = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get('/api/cars/getallcars', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data)) {
        setCars(response.data);
      } else if (Array.isArray(response.data.cars)) {
        setCars(response.data.cars);
      } else {
        console.error('Unexpected response:', response.data);
      }
    } catch (error) {
      console.error('Failed to fetch cars:', error);
    }
  };

  fetchCars();
}, []);

  return (
    <AdminLayout>
      <div className="container py-4">
        <h1 className="mb-4 text-center display-4 fw-bold">Manage Cars</h1>

        {cars.length === 0 ? (
          <p className="text-center">No cars found.</p>
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
