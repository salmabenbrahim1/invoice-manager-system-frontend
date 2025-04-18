import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user) {
   
// If the user is not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    // If the user does not have the appropriate role, redirect to the "unauthorized" page
    return <Navigate to="/unauthorized" />;
  }

  return children; // If the user is logged in and has the correct role, display the child
};

export default PrivateRoute;
