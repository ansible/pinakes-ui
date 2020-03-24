import React, { useContext } from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import UserContext from '../user-context';
import PropTypes from 'prop-types';
import { hasPermission } from '../helpers/shared/helpers';

const CatalogRoute = ({ permissions, ...props }) => {
  const { permissions: userPermissions } = useContext(UserContext);
  const hasPermissions = hasPermission(userPermissions, permissions);
  const location = useLocation();

  return hasPermissions ? (
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
