import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

export default function ProtectedRoute({ children }) {
  return authService.isAuthenticated() ? children : <Navigate to="/admin/login" />;
}
