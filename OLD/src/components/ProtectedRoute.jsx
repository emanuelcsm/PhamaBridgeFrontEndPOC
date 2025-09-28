import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const ProtectedRoute = ({ requiresAuth = true }) => {
  const { user, loading } = useAuth();
  
  // While checking authentication status, show nothing or a loading indicator
  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  // If we require authentication and user is not authenticated, redirect to login
  if (requiresAuth && !user) {
    return <Navigate to="/login" replace />;
  }
  
  // If user is authenticated but tries to access login page, redirect to home
  if (!requiresAuth && user) {
    return <Navigate to="/" replace />;
  }

  // If all conditions are met, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;