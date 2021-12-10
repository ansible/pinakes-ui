/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { EXTERNAL_LOGIN_URI } from '../utilities/constants';
import { getUser } from '../helpers/shared/active-user';

const CatalogRoute = ({ ...props }) => {
  const user = localStorage.getItem('user');
  useEffect(() => {
    getUser()
      .then((user) => {
        localStorage.setItem('user', user);
      })
      .catch((reason) => localStorage.removeItem('user'));
  }, []);

  if (!user) {
    window.location.replace(EXTERNAL_LOGIN_URI);
    return <div />;
  }

  return <Route {...props} />;
};

export default CatalogRoute;
