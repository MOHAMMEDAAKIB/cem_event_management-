import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Camera, User, Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import collegeLogo from '../pages/assets/icon.jpg';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
    { path: '/gallery', label: 'Gallery', icon: Camera },
    { path: '/admin/login', label: 'Admin', icon: User },
  ];

  const contactInfo = [
    { icon: Phone, text: '021 223 0036' },
    { icon: Mail, text: 'info@jcoe.edu.lk' },
    { icon: MapPin, text: 'Jaffna College of Education,Kopay, Jaffna' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container py-12">
        <div className="grid pt-12 md:grid-cols-4 gap-8 pb-12">
          {/* College Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white p-2 shadow-lg">
                <img 
                  src={collegeLogo} 
                  alt="College Logo" 
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">JCoE Event Hub</h3>
                <p className="text-gray-400 text-sm">Jaffna National College of Education</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering education through innovative event management. Creating memorable 
              experiences that bring our academic community together and foster learning excellence.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center gap-3 text-gray-300">
                  <item.icon className="w-4 h-4 text-primary-green" />
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map(({ path, label, icon: Icon }) => (
                <li key={path}>
                  <Link 
                    to={path}
                    className="flex items-center gap-2 text-gray-300 hover:text-secondary-yellow transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Connect With Us</h4>
            <div className="flex gap-3 mb-6">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-green transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <h5 className="font-semibold mb-2 text-white">Newsletter</h5>
              <p className="text-gray-400 text-sm mb-3">Stay updated with our latest events</p>
              <div className="block gap-2 ">
                <input 
                  type="email" 
                  placeholder="Your email"
                  className="flex-1 mt-1 px-3 py-2 text-sm bg-gray-700 text-white rounded-md border border-gray-600 focus:border-primary-green focus:outline-none"
                />
                <button className="px-4 mt-2 py-2 bg-primary-green text-white rounded-md hover:bg-primary-green-dark transition-colors text-sm font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © {currentYear} Jaffna National College of Education. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <Link to="#" className="text-gray-400 hover:text-secondary-yellow transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="text-gray-400 hover:text-secondary-yellow transition-colors">
                Terms of Service
              </Link>
              <Link to="#" className="text-gray-400 hover:text-secondary-yellow transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
