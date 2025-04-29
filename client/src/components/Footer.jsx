// components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-light text-center text-muted py-3 mt-5">
      <div>&copy; {new Date().getFullYear()} RevCar. All rights reserved.</div>
    </footer>
  );
};

export default Footer;
