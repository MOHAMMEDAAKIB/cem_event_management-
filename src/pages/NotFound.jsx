import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-8xl font-bold text-primary-green mb-4">404</div>
            <div className="w-24 h-1 bg-secondary-yellow mx-auto rounded-full"></div>
          </div>

          {/* Content */}
          <h1 className="heading-1 mb-4">Page Not Found</h1>
          <p className="text-lg text-muted mb-8 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. 
            The page might have been moved, deleted, or you may have entered the wrong URL.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/" className="btn btn-primary">
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Link>
            <Link to="/calendar" className="btn btn-outline">
              <Search className="w-5 h-5 mr-2" />
              Browse Events
            </Link>
          </div>

          {/* Popular Links */}
          <div className="card max-w-md mx-auto">
            <div className="card-header">
              <h3 className="heading-3 mb-0">Popular Pages</h3>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                <Link 
                  to="/calendar" 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Search className="w-5 h-5 text-primary-green" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Event Calendar</div>
                    <div className="text-sm text-gray-600">View upcoming events</div>
                  </div>
                </Link>
                
                <Link 
                  to="/gallery" 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Search className="w-5 h-5 text-secondary-yellow-dark" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Event Gallery</div>
                    <div className="text-sm text-gray-600">Browse past events</div>
                  </div>
                </Link>
                
                <Link 
                  to="/admin/login" 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Search className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Admin Portal</div>
                    <div className="text-sm text-gray-600">Manage events</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-outline mt-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
