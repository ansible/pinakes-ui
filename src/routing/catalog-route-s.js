/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { EXTERNAL_LOGIN_URI } from '../utilities/constants';
import { getUser } from '../helpers/shared/active-user';

const CatalogRoute = ({ ...props }) => {
  let user = JSON.parse(localStorage.getItem('catalog_user'));
  useEffect(() => {
    getUser()
      .then((user) => {
        localStorage.setItem('catalog_user', JSON.stringify(user));
      })
      .catch((reason) => {
        user = null;
        localStorage.removeItem('catalog_user');
      });
  }, []);

  if (!user) {
    window.location.replace(EXTERNAL_LOGIN_URI);
    return <div />;
  }

  return <Route {...props} />;
};

export default CatalogRoute;
