import React from 'react';
import { Button } from 'react-bootstrap';
import './CarCard.css'; 

const CarCard = ({ car, onBook }) => {
  return (
    <div className="card car-card text-center h-100 shadow-sm">
      <img src={car.image} className="card-img-top p-3 car-image" alt={car.name} />
      <div className="card-body d-flex flex-column justify-content-between">
        <h5 className="card-title">{car.name}</h5>
        <p className="card-text text-muted mb-3">Rent Per Hour ₹{car.rentPerHour}</p>
        <Button variant="outline-dark" onClick={() => onBook(car)}>
          Book Now
        </Button>
      </div>
    </div>
  );
};

export default CarCard;
