import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function PrivateRoute({ element }) {
  const role = localStorage.getItem('role');
  const email = localStorage.getItem('user');
  const adminSecret = localStorage.getItem('key');
  
  const authorizedEmail = process.env.REACT_APP_ADMIN_EMAIL;
  const authorizedSecret = process.env.REACT_APP_ADMIN_SECRET;
  if (role === 'admin' && email === authorizedEmail && adminSecret === authorizedSecret) {
    return element;
  }
  return <Navigate to="/" replace />;
}

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default PrivateRoute;