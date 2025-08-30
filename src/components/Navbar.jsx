import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Camera, User, Menu, X, Home, List } from 'lucide-react';
import collegeLogo from '../pages/assets/icon.jpg';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/events', label: 'Events', icon: List },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
    { path: '/gallery', label: 'Gallery', icon: Camera },
    { path: '/admin/login', label: 'Admin', icon: User },
  ];

  return (
    <nav className="bg-white/10 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 text-2xl font-bold text-primary-green hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-white p-1 shadow-md">
              <img 
                src={collegeLogo} 
                alt="College Logo" 
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <span className="hidden sm:block text-[#186A3B]">JCoE Event Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive(path)
                    ? 'bg-primary-green text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-primary-green'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 fade-in">
            <div className="flex flex-col gap-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive(path)
                      ? 'bg-primary-green text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-primary-green'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
