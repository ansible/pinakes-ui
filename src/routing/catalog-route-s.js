/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { EXTERNAL_LOGIN_URI } from '../utilities/constants';
import { getUser } from '../helpers/shared/active-user';

const CatalogRoute = ({ ...props }) => {
  useEffect(() => {
    getUser()
      .then((user) => {
        localStorage.setItem('catalog_user', JSON.stringify(user));
      })
      .catch((reason) => {
        localStorage.removeItem('catalog_user');
      });
  }, []);
  if (!localStorage.getItem('catalog_user')) {
    window.location.replace(EXTERNAL_LOGIN_URI);
    return <div />;
  }

  return <Route {...props} />;
};

export default CatalogRoute;
