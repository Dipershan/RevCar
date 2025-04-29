import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import CarCard from '../components/CarCard';
import SOSButton from '../components/SOSButton';

const Home = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCars = async () => {
    try {
      const response = await axios.get('/api/cars/getallcars');
      setCars(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch cars:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleBookNow = (car) => {
    navigate(`/booking/${car._id}`);
  };

  if (loading) return <Loader />;

  return (
    <>
  <Header />

  <div className="position-relative">  
  <div
    className="position-fixed bg-white shadow rounded p-3"
    style={{ top: '80px', left: '30px', zIndex: 1050, width: '250px' }}
  >
    <h5 className="text-center mb-3">🚨 Emergency Help</h5>
    <SOSButton />
  </div>

  <div className="container mt-5">
    <h1 className="text-center mb-4">Available Cars</h1>
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
      {cars.map((car) => (
        <div key={car._id} className="col mb-4">
          <CarCard car={car} onBook={handleBookNow} />
        </div>
      ))}
    </div>
  </div>
</div>


  <Footer />
</>

  );
};

export default Home;
