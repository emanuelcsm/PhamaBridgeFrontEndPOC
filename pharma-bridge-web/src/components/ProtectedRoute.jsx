import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import styled from 'styled-components';

// Estilizando um componente de loading
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: ${props => props.theme.colors.background};
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid ${props => props.theme.colors.primary};
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ProtectedRoute = ({ requiresAuth = true, requiredRole = null }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  
  // While checking authentication status, show loading indicator
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  // If we require authentication and user is not authenticated, redirect to sign in
  if (requiresAuth && !isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  
  // If we require a specific role and user doesn't have it, redirect to appropriate page
  if (requiresAuth && requiredRole && isAuthenticated) {
    const hasRequiredRole = user.roles.includes(requiredRole);
    
    if (!hasRequiredRole) {
      // If the user is a customer, redirect to user main page
      if (user.roles.includes('ROLE_CUSTOMER')) {
        return <Navigate to="/user/home" replace />;
      }
      // If the user is a pharmacy, redirect to pharmacy main page
      if (user.roles.includes('ROLE_PHARMACY')) {
        return <Navigate to="/pharmacy/home" replace />;
      }
      // Fallback to sign in if no recognized role
      return <Navigate to="/signin" replace />;
    }
  }
  
  // If user is authenticated but tries to access sign in page, redirect based on role
  if (!requiresAuth && isAuthenticated) {
    if (user.roles.includes('ROLE_CUSTOMER')) {
      return <Navigate to="/user/home" replace />;
    }
    if (user.roles.includes('ROLE_PHARMACY')) {
      return <Navigate to="/pharmacy/home" replace />;
    }
    // Fallback to a default location if no recognized role
    return <Navigate to="/" replace />;
  }

  // If all conditions are met, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;