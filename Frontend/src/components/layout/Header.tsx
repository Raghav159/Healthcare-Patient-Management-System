import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Settings, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and title */}
          <div className="flex items-center">
            <button 
              className="md:hidden mr-2" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/" className="flex items-center">
              <div className="text-primary-700 font-bold text-2xl">HPMS</div>
              <div className="hidden md:block ml-2 text-gray-600 text-sm">
                Healthcare Patient Management System
              </div>
            </Link>
          </div>

          {/* Navigation items */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="text-gray-700 hover:text-primary-700">
              Dashboard
            </Link>
            <Link to="/appointments" className="text-gray-700 hover:text-primary-700">
              Appointments
            </Link>
            <Link to="/patients" className="text-gray-700 hover:text-primary-700">
              Patients
            </Link>
            <Link to="/doctors" className="text-gray-700 hover:text-primary-700">
              Doctors
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-primary-700">
              <Bell size={20} />
            </button>
            <button className="text-gray-600 hover:text-primary-700">
              <Settings size={20} />
            </button>
            <div className="avatar placeholder">
              <div className="bg-primary-700 text-white rounded-full w-8">
                <span>US</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 border-t pt-4">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/dashboard" 
                className="text-gray-700 hover:text-primary-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/appointments" 
                className="text-gray-700 hover:text-primary-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Appointments
              </Link>
              <Link 
                to="/patients" 
                className="text-gray-700 hover:text-primary-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Patients
              </Link>
              <Link 
                to="/doctors" 
                className="text-gray-700 hover:text-primary-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Doctors
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;