/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { getUser, loginUser } from '../helpers/shared/active-user';

const CatalogRoute = ({ ...props }) => {
  return <Route {...props} />;
};

export default CatalogRoute;
