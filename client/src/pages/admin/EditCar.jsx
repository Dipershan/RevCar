import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout'; // Optional if you're using a layout wrapper

const EditCar = () => {
  const { carid } = useParams();
  const [carData, setCarData] = useState({
    name: '',
    image: '',
    rentPerHour: '',
    capacity: '',
    fuelType: '',
    availabilityStatus: 'Available',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await axios.get(`/api/cars/getcar/${carid}`);
        setCarData({
          name: res.data.name,
          image: res.data.image,
          rentPerHour: res.data.rentPerHour,
          capacity: res.data.capacity,
          fuelType: res.data.fuelType,
          availabilityStatus: res.data.availabilityStatus || 'Available',
        });
      } catch (error) {
        console.error('Failed to load car details:', error);
      }
    };
    fetchCar();
  }, [carid]);

  const handleChange = (e) => {
    setCarData({ ...carData, [e.target.name]: e.target.value });
  };
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this car?");
    if (!confirmDelete) return;
  
    try {
      await axios.post(`/api/cars/deletecar`, { _id: carid });
      alert("Car deleted successfully!");
      navigate('/admin');
    } catch (error) {
      console.error("Failed to delete car:", error);
      alert("Something went wrong while deleting the car.");
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/cars/editcar`, { ...carData, _id: carid });
      alert('Car updated successfully!');
      navigate('/admin');
    } catch (error) {
      console.error('Failed to update car:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Edit Car</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="name"
              placeholder="Car Name"
              value={carData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <input
              name="image"
              placeholder="Image URL"
              value={carData.image}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <input
              name="rentPerHour"
              type="number"
              placeholder="Rent per Hour"
              value={carData.rentPerHour}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <input
              name="capacity"
              type="number"
              placeholder="Capacity"
              value={carData.capacity}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <input
              name="fuelType"
              placeholder="Fuel Type (Petrol/Diesel/EV)"
              value={carData.fuelType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />

            <select
              name="availabilityStatus"
              value={carData.availabilityStatus}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
              <option value="In Service">In Service</option>
            </select>
            <div className="flex gap-4 mt-6">
            <button
              type="submit"
              class="btn btn-primary"
            >
              Update Car
            </button>

            <button
              type="button"
              onClick={handleDelete}
              class="btn btn-danger"
            >
              Delete Car
            </button>
          </div>


          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditCar;
