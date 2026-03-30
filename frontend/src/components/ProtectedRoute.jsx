import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('user_role'); // 'admin' ya 'user'
  const location = useLocation();

  // 1. Agar login nahi hai toh login page par bhejo
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Agar page sirf Admin ke liye hai aur user Student hai
  if (adminOnly && userRole !== 'admin') {
    return <Navigate to="/" replace />; // Home par redirect kar do
  }

  // 3. Sab sahi hai toh page dikhao
  return children;
};

export default ProtectedRoute;