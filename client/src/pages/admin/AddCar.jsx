import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

const AddCar = () => {
  const [car, setCar] = useState({
    name: '',
    image: '',
    rentPerHour: '',
    capacity: '',
    fuelType: '',
    availabilityStatus: 'Available',
    serviceRecords: [],
  });

  const [serviceDate, setServiceDate] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');

  const handleChange = (e) => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  const addServiceRecord = () => {
    if (serviceDate && serviceDescription) {
      setCar({
        ...car,
        serviceRecords: [
          ...car.serviceRecords,
          { date: serviceDate, description: serviceDescription },
        ],
      });
      setServiceDate('');
      setServiceDescription('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(car);
    // send to backend here
  };

  return (
    <AdminLayout>
      <div className="container py-4">
        <h1 className="text-center display-5 fw-bold mb-4">Add New Car</h1>

        <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Car Name"
                value={car.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                name="image"
                className="form-control"
                placeholder="Image URL"
                value={car.image}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4">
              <input
                type="number"
                name="rentPerHour"
                className="form-control"
                placeholder="Rent per Hour"
                value={car.rentPerHour}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4">
              <input
                type="number"
                name="capacity"
                className="form-control"
                placeholder="Capacity"
                value={car.capacity}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                name="fuelType"
                className="form-control"
                placeholder="Fuel Type (Petrol/Diesel/EV)"
                value={car.fuelType}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4">
              <select
                name="availabilityStatus"
                className="form-select"
                value={car.availabilityStatus}
                onChange={handleChange}
              >
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>
          </div>

          <hr />

          <h5 className="mb-3">Service Record</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Service Description"
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <button
                type="button"
                className="btn btn-outline-primary w-100"
                onClick={addServiceRecord}
              >
                Add Service
              </button>
            </div>
          </div>

          {car.serviceRecords.length > 0 && (
            <ul className="list-group mb-4">
              {car.serviceRecords.map((record, index) => (
                <li key={index} className="list-group-item">
                  {record.date} — {record.description}
                </li>
              ))}
            </ul>
          )}

          <div className="text-end">
            <button type="submit" className="btn btn-success">
              Add Car
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddCar;
