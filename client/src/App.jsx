import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import Header from './components/Header';
import Home from './pages/Home';
import Cars from './pages/Cars';
import MyBookings from './components/MyBookings';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import BookingCar from './pages/BookingCar';
import SOSModal from './components/SOSButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AdminHome from './pages/admin/AdminHome';
import AddCar from './pages/admin/AddCar';
import EditCar from './pages/admin/EditCar';
import AdminUserList from './pages/admin/AdminUserList';
import UserProfile from './pages/UserProfile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function AppContent() {
  const [showSosModal, setShowSosModal] = useState(false);
  const location = useLocation();
  
  // Hide header on login, register, forgot-password, reset-password, and admin pages
  const hideHeaderPaths = ['/login', '/register', '/forgot-password', '/admin'];
  const shouldHideHeader = hideHeaderPaths.some(path => location.pathname.startsWith(path));

  // Manage body class for padding
  useEffect(() => {
    if (shouldHideHeader) {
      document.body.classList.add('no-header');
    } else {
      document.body.classList.remove('no-header');
    }

    // Cleanup function
    return () => {
      document.body.classList.remove('no-header');
    };
  }, [shouldHideHeader]);

  return (
    <>
      {!shouldHideHeader && <Header onSOSClick={() => setShowSosModal(true)} />}
      
      <SOSModal show={showSosModal} handleClose={() => setShowSosModal(false)} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/booking/:carid" element={<BookingCar />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/addcar" element={<AddCar />} />
        <Route path="/admin/editcar/:carId" element={<EditCar />} />
        <Route path="/admin/users" element={<AdminUserList />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
