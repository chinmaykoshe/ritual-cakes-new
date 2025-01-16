import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function PrivateRoute({ element }) {
  const role = localStorage.getItem('role'); // Retrieve role from localStorage

  // Check if the role is 'admin'
  if (role === 'admin') {
    return element; // Render the element if user is admin
  }

  // Redirect to '/signup' if not authorized
  return <Navigate to="/login" replace />;
}

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default PrivateRoute;
