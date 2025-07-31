// import axios from '../api/axiosInstance';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice"; 

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [scrolled, setScrolled] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`navbar navbar-expand-lg fixed-top transition-all ${
      scrolled ? 'navbar-light bg-white shadow-lg' : 'navbar-dark bg-transparent'
    }`}
    style={{
      transition: 'all 0.3s ease-in-out',
      padding: scrolled ? '0.5rem 0' : '1rem 0'
    }}>
      <div className="container">
        <Link 
          className="navbar-brand d-flex align-items-center" 
          to="/"
          style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            background: scrolled ? 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' : 'white',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            transition: 'all 0.3s ease'
          }}
        >
          <i className={`bi bi-car-front-fill me-2 ${scrolled ? 'text-primary' : 'text-white'}`}
             style={{ WebkitTextFillColor: scrolled ? '' : 'white' }}></i>
          RevCar
        </Link>
        
        <button 
          className={`navbar-toggler ${scrolled ? '' : 'border-white'}`}
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className={`navbar-toggler-icon ${scrolled ? '' : 'text-white'}`}></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {[
              { path: '/', label: 'Home' },
              { path: '/blog', label: 'Blog' },
              { path: '/contact', label: 'Contact' },
              ...(user ? [{ path: '/bookings', label: 'My Bookings' }] : []),
              ...(user?.isAdmin ? [{ path: '/admin', label: 'Admin' }] : [])
            ].map((item) => (
              <li className="nav-item" key={item.path}>
                <Link 
                  className={`nav-link px-3 position-relative ${isActive(item.path) ? 'active' : ''}`}
                  to={item.path}
                  style={{
                    color: scrolled ? '#1e3c72' : 'white',
                    fontWeight: '500'
                  }}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <span 
                      className="position-absolute bottom-0 start-0 w-100"
                      style={{
                        height: '2px',
                        background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)',
                        transition: 'all 0.3s ease'
                      }}
                    ></span>
                  )}
                </Link>
              </li>
            ))}
            
            {user ? (
              <li className="nav-item dropdown ms-3">
                <a 
                  className={`nav-link dropdown-toggle d-flex align-items-center ${scrolled ? 'text-dark' : 'text-white'}`}
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown"
                  style={{ fontWeight: '500' }}
                >
                  <div 
                    className="rounded-circle me-2 d-flex align-items-center justify-content-center"
                    style={{
                      width: '35px',
                      height: '35px',
                      background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)',
                      color: '#1e3c72'
                    }}
                  >
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  {user.name || 'Profile'}
                </a>
                <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg mt-2">
                  <li>
                    <Link className="dropdown-item py-2" to="/profile">
                      <i className="bi bi-person me-2"></i>Profile
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button 
                      className="dropdown-item py-2 text-danger" 
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item ms-3">
                  <Link 
                    className={`nav-link ${scrolled ? 'text-dark' : 'text-white'}`}
                    to="/login"
                    style={{ fontWeight: '500' }}
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item ms-3">
                  <Link 
                    className="nav-link btn px-4 py-2"
                    to="/register"
                    style={{
                      background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)',
                      color: '#1e3c72',
                      fontWeight: '600',
                      borderRadius: '50px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
