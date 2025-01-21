import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function PrivateRoute({ element }) {
  const role = localStorage.getItem('role'); // Retrieve role from localStorage
  const email = localStorage.getItem('user'); // Retrieve role from localStorage

  const authorizedEmail = "ritualcake.admin@gmail.com";

  // Check if the role is 'admin'
  if (role === 'admin' && email === authorizedEmail) {
    return element; // Render the element if user is admin
  }

  // Redirect to '/signup' if not authorized
  return <Navigate to="/login" replace />;
}

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default PrivateRoute;
