import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';

export const UnauthorizedRedirect = () => {
  const location = useLocation();
  return (
    <Redirect
      to={{
        pathname: '/401',
        state: {
          from: location
        }
      }}
    />
  );
};
