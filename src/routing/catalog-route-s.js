/* eslint-disable react/prop-types */
import React from 'react';
import { Route } from 'react-router-dom';
import LoginPage from '../smart-components/login/login';

const RedirectToLogin = (props) => (
  <Route {...props}>
    <LoginPage {...props} />
  </Route>
);

const CatalogRoute = ({ ...props }) => {
  console.log('debug - catalog route');
  if (!window.catalog?.token) {
    console.log('debug - catalog route - token: indow.catalog?.token');
    return <RedirectToLogin {...props} from={location.pathname} />;
  }

  return <Route {...props} />;
};

export default CatalogRoute;
