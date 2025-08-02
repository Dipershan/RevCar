// import axios from '../api/axiosInstance';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice"; 

const Header = ({ onSOSClick }) => {
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
    <nav className={`navbar navbar-expand-lg fixed-top ${scrolled ? 'navbar-light bg-white shadow-lg' : 'navbar-dark'}`}
    style={{
      transition: 'all 0.3s ease-in-out',
      padding: scrolled ? '0.5rem 0' : '0.75rem 0',
      background: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(30, 60, 114, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: scrolled ? '1px solid rgba(0,0,0,0.1)' : 'none'
    }}>
      <div className="container">
        <Link 
          className="navbar-brand d-flex align-items-center" 
          to="/"
          style={{
            fontSize: '1.6rem',
            fontWeight: '800',
            color: scrolled ? '#1e3c72' : 'white',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            letterSpacing: '-0.5px'
          }}
        >
          <i className={`bi bi-car-front-fill me-2 ${scrolled ? 'text-primary' : 'text-white'}`}
             style={{ 
               fontSize: '1.4rem',
               WebkitTextFillColor: scrolled ? '#1e3c72' : 'white'
             }}></i>
          RevCar
        </Link>
        
        <button 
          className={`navbar-toggler ${scrolled ? 'border-dark' : 'border-white'}`}
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          style={{ borderWidth: '2px' }}
        >
          <span className={`navbar-toggler-icon ${scrolled ? '' : 'text-white'}`}></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {[
              { path: '/', label: 'Home' },
              { path: '/cars', label: 'Cars' },
              { path: '/contact', label: 'Contact' },
              ...(user ? [{ path: '/bookings', label: 'My Bookings' }] : []),
              ...(user ? [{ path: '/profile', label: 'Profile' }] : []),
              ...(user?.isAdmin ? [{ path: '/admin', label: 'Admin' }] : [])
            ].map((item) => (
              <li className="nav-item" key={item.path}>
                <Link 
                  className={`nav-link px-3 position-relative ${isActive(item.path) ? 'active' : ''}`}
                  to={item.path}
                  style={{
                    color: scrolled ? '#1e3c72' : 'white',
                    fontWeight: '500',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <span 
                      className="position-absolute bottom-0 start-50 translate-middle-x"
                      style={{
                        height: '2px',
                        width: '60%',
                        background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)',
                        borderRadius: '2px',
                        transition: 'all 0.3s ease'
                      }}
                    ></span>
                  )}
                </Link>
              </li>
            ))}
            
            {user ? (
              <li className="nav-item dropdown ms-3">
                <button 
                  className={`nav-link dropdown-toggle d-flex align-items-center ${scrolled ? 'text-dark' : 'text-white'}`}
                  type="button"
                  data-bs-toggle="dropdown"
                  style={{ 
                    fontWeight: '500', 
                    cursor: 'pointer', 
                    background: 'none', 
                    border: 'none',
                    fontSize: '0.95rem',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '50px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div 
                    className="rounded-circle me-2 d-flex align-items-center justify-content-center"
                    style={{
                      width: '32px',
                      height: '32px',
                      background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)',
                      color: '#1e3c72',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      boxShadow: '0 2px 8px rgba(0, 255, 135, 0.3)'
                    }}
                  >
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span style={{ fontWeight: '500' }}>{user.name || 'Profile'}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg mt-2" style={{ borderRadius: '12px', minWidth: '180px' }}>
                  <li>
                    <Link className="dropdown-item py-2 px-3" to="/profile" style={{ borderRadius: '12px 12px 0 0' }}>
                      <i className="bi bi-person me-2"></i>Profile
                    </Link>
                  </li>
                  <li>
                    <button 
                      className="dropdown-item py-2 px-3 text-danger" 
                      onClick={onSOSClick}
                      style={{ fontWeight: '500' }}
                    >
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      SOS Emergency
                    </button>
                  </li>
                  <li><hr className="dropdown-divider my-1" /></li>
                  <li>
                    <button 
                      className="dropdown-item py-2 px-3 text-danger" 
                      onClick={handleLogout}
                      style={{ borderRadius: '0 0 12px 12px', fontWeight: '500' }}
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
                    style={{ 
                      fontWeight: '500',
                      fontSize: '0.95rem',
                      padding: '0.4rem 1.2rem',
                      borderRadius: '50px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item ms-2">
                  <Link 
                    className="nav-link btn px-3 py-2"
                    to="/register"
                    style={{
                      background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)',
                      color: '#1e3c72',
                      fontWeight: '600',
                      borderRadius: '50px',
                      transition: 'all 0.3s ease',
                      fontSize: '0.95rem',
                      boxShadow: '0 2px 8px rgba(0, 255, 135, 0.3)'
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
