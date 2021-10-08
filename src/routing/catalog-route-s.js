/* eslint-disable react/prop-types */
import React from 'react';
import { Route } from 'react-router-dom';
import LoginPage from '../smart-components/login/login';

const RedirectToLogin = (props) => (
  <Route {...props}>
    <LoginPage />
  </Route>
);

const CatalogRoute = ({ ...props }) => {
  if (!window.catalog?.token) {
    return <RedirectToLogin {...props} />;
  }

  return <Route {...props} />;
};

export default CatalogRoute;
