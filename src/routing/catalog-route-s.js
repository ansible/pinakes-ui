/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { AUTH_API_BASE } from '../utilities/constants';
import { getUser } from '../helpers/shared/active-user';

const CatalogRoute = ({ ...props }) => {
  useEffect(() => {
    getUser()
      .then((user) => {
        localStorage.setItem('catalog_user', JSON.stringify(user));
      })
      .catch((error) => {
        localStorage.removeItem('catalog_user');
        throw error;
      });
  }, []);
  if (!localStorage.getItem('catalog_user')) {
    window.location.replace(`${AUTH_API_BASE}/login/`);
    return <div />;
  }

  return <Route {...props} />;
};

export default CatalogRoute;
