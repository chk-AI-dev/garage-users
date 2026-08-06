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
  // Check if the user has the required role(s)
  if (requiredRole && !Array.isArray(requiredRole)) {
    requiredRole = [requiredRole];
  }
  // If a required role is specified and the user's role does not match, redirect to the dashboard
  if (requiredRole && !requiredRole.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
// Export the ProtectedRoute component for use in other parts of the application
export default ProtectedRoute;
