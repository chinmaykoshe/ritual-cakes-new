import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function PrivateRoute({ element }) {
  const role = localStorage.getItem('role');
  const email = localStorage.getItem('user');
  const authorizedEmail = "ritualcake.admin@gmail.com";
  if (role === 'admin' && email === authorizedEmail) {
    return element;
  }
  return <Navigate to="/" replace />;
}

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default PrivateRoute;