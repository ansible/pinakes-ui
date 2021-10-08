/* eslint-disable react/prop-types */
import React from 'react';
import { Redirect, Route, useLocation } from 'react-router-dom';
import { useHistory } from 'react-router';

const RedirectToLogin = (props) => {
  const location = useLocation();
  const history = useHistory();
  console.log('debug - catalog route - location: ', location);
  return history.push('http://0.0.0.0:8002/catalog/portfolios/login');
};

const CatalogRoute = ({ ...props }) => {
  console.log('debug - catalog route - token: ', window.catalog?.token);
  if (!window.catalog?.token) {
    return <RedirectToLogin {...props} />;
  }

  return <Route {...props} />;
};

export default CatalogRoute;
