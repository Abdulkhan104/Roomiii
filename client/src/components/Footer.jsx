import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-3xl font-semibold">ROOMOO.com</h2>
          <p className="mt-2 text-gray-300">Comfortable and budget-friendly rooms for students.</p>
        </div>
        <div className="mt-8 md:mt-0 space-y-4 md:space-y-0 md:flex md:space-x-12">
          <div className="md:w-1/3 space-y-4">
            <h3 className="text-xl font-semibold">Quick Links</h3>
            <Link to="/" className="hover:text-gray-400 transition-colors duration-300 block">Home</Link>
            <Link to="/rooms" className="hover:text-gray-400 transition-colors duration-300 block">Rooms</Link>
            <Link to="/about" className="hover:text-gray-400 transition-colors duration-300 block">About Us</Link>
            <Link to="/contact" className="hover:text-gray-400 transition-colors duration-300 block">Contact</Link>
            <Link to="/faq" className="hover:text-gray-400 transition-colors duration-300 block">FAQ</Link>
          </div>
          <div className="md:w-1/3 space-y-4">
            <h3 className="text-xl font-semibold">Contact Us</h3>
            <p className="text-gray-300">123 Student Street</p>
            <p className="text-gray-300">City, Country</p>
            <p className="text-gray-300">contact@example.com</p>
          </div>
          <div className="md:w-1/3 space-y-4">
            <h3 className="text-xl font-semibold">More Information</h3>
            <Link to="/terms" className="hover:text-gray-400 transition-colors duration-300 block">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-gray-400 transition-colors duration-300 block">Privacy Policy</Link>
            <Link to="/guidelines" className="hover:text-gray-400 transition-colors duration-300 block">Renting Guidelines</Link>
            <Link to="/community" className="hover:text-gray-400 transition-colors duration-300 block">Community Guidelines</Link>
          </div>
        </div>
      </div>
      <div className="mt-12 text-center text-gray-300">
        <p>&copy; 2026 Developed by Abdul Khan</p>
      </div>
    </footer>
  );
};

export default Footer;
