import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
// ProtectedRoute component to guard routes based on authentication and roles
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user } = useAuth();
  // Check if the user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  // If a requiredRole is specified, check if the user's role matches
  if (requiredRole && !Array.isArray(requiredRole)) {
    requiredRole = [requiredRole];
  }

  if (requiredRole && !requiredRole.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
