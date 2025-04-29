// AdminLayout.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    // clear admin session and redirect to login
    localStorage.removeItem('adminData');
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <NavLink className="navbar-brand d-flex align-items-center" to="/admin">
            <i className="bi bi-car-front-fill me-2"></i>
            Car Rental
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#adminNavbar"
            aria-controls="adminNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="adminNavbar">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {/* <li className="nav-item">
                <NavLink className="nav-link" to="/admin">
                  Manage Cars
                </NavLink>
              </li> */}
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin/addcar">
                  Add Car
                </NavLink>
              </li>
            </ul>
            <button
              className="btn btn-outline-light"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <div className="container my-4">
        {children}
      </div>
    </>
  );
}
