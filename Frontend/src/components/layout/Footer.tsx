// src/components/layout/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-base-100 border-t border-gray-200 py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-600">
            © {new Date().getFullYear()} Healthcare Patient Management System. All rights reserved.
          </div>
          <div className="mt-2 md:mt-0 text-sm text-gray-600">
            <a href="#" className="hover:text-primary mr-4">Privacy Policy</a>
            <a href="#" className="hover:text-primary mr-4">Terms of Service</a>
            <a href="#" className="hover:text-primary">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;