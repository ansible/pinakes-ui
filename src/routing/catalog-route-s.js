/* eslint-disable react/prop-types */
import React from 'react';
import { Route } from 'react-router-dom';
import { EXTERNAL_LOGIN_URI } from '../utilities/constants';

const CatalogRoute = ({ ...props }) => {
  if (!localStorage.getItem('catalog-token')) {
    localStorage.setItem('catalog-token', 'test');
    window.location.replace(EXTERNAL_LOGIN_URI);
    return <div />;
  }

  return <Route {...props} />;
};

export default CatalogRoute;
