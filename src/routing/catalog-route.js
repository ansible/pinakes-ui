import React, { useContext } from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import UserContext from '../user-context';
import PropTypes from 'prop-types';

const CatalogRoute = ({ permissions, ...props }) => {
  const { permissions: userPermissions } = useContext(UserContext);
  const hasPermission = permissions.every((permission) =>
    userPermissions.find((item) => item.permission === permission)
  );
  const location = useLocation();

  return hasPermission ? (
    <Route {...props} />
  ) : (
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

CatalogRoute.propTypes = {
  permissions: PropTypes.arrayOf(PropTypes.string)
};

CatalogRoute.defaultProps = {
  permissions: []
};

export default CatalogRoute;
