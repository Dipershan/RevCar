// import axios from '../api/axiosInstance';
import React from 'react';
import { Link, useNavigate } from "react-router-dom"; 

const Header = () => {

  const navigate = useNavigate(); 
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">🚗 Car Rental</Link>
      <div className="ms-auto dropdown">
        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          id="userMenu"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          👤 User
        </button>

        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
          <li>
            <Link className="dropdown-item" to="/userbookings">My Bookings</Link>
          </li>
          <li>
            <button className="dropdown-item" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
