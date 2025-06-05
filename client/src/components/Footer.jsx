// components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-5">
      <div className="py-5" style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white'
      }}>
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <h5 className="mb-4 text-white">About Us</h5>
              <p className="text-white-50">
                Established in 2024, RevCar stands as Nepal's premier vehicle rental service, 
                offering an unparalleled experience in travel with a commitment to excellence.
              </p>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <h5 className="mb-4 text-white">Quick Links</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link to="/about" className="text-white-50 text-decoration-none hover-white">About Us</Link>
                </li>
                <li className="mb-2">
                  <Link to="/services" className="text-white-50 text-decoration-none hover-white">Our Services</Link>
                </li>
                <li className="mb-2">
                  <Link to="/blog" className="text-white-50 text-decoration-none hover-white">Blog</Link>
                </li>
                <li className="mb-2">
                  <Link to="/contact" className="text-white-50 text-decoration-none hover-white">Contact Us</Link>
                </li>
              </ul>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <h5 className="mb-4 text-white">Contact Info</h5>
              <ul className="list-unstyled text-white-50">
                <li className="mb-2">
                  <i className="bi bi-geo-alt me-2"></i>
                  Trade Tower, Thapathali, Kathmandu
                </li>
                <li className="mb-2">
                  <i className="bi bi-telephone me-2"></i>
                  01-5971616
                </li>
                <li className="mb-2">
                  <i className="bi bi-phone me-2"></i>
                  9801101924
                </li>
                <li className="mb-2">
                  <i className="bi bi-envelope me-2"></i>
                  info@revcar.com
                </li>
              </ul>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <h5 className="mb-4 text-white">Follow Us</h5>
              <div className="d-flex gap-3">
                <a href="#" className="text-white fs-5"><i className="bi bi-facebook"></i></a>
                <a href="#" className="text-white fs-5"><i className="bi bi-instagram"></i></a>
                <a href="#" className="text-white fs-5"><i className="bi bi-linkedin"></i></a>
                <a href="#" className="text-white fs-5"><i className="bi bi-youtube"></i></a>
              </div>
              <div className="mt-4">
                <h6 className="text-white mb-3">Download Our App</h6>
                <div className="d-flex gap-2">
                  <a href="#" className="btn btn-light btn-sm">
                    <i className="bi bi-apple me-2"></i>App Store
                  </a>
                  <a href="#" className="btn btn-light btn-sm">
                    <i className="bi bi-google-play me-2"></i>Play Store
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="py-3" style={{ background: '#152850', color: 'white' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-0 text-white-50">
                © {new Date().getFullYear()} RevCar. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
              <ul className="list-inline mb-0">
                <li className="list-inline-item">
                  <Link to="/privacy" className="text-white-50 text-decoration-none">Privacy Policy</Link>
                </li>
                <li className="list-inline-item ms-3">
                  <Link to="/terms" className="text-white-50 text-decoration-none">Terms of Use</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
