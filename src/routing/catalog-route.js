import React, { useContext } from 'react';
import { Route } from 'react-router-dom';
import UserContext from '../user-context';
import PropTypes from 'prop-types';
import { hasPermission } from '../helpers/shared/helpers';
import { UnauthorizedRedirect } from '../smart-components/error-pages/error-redirects';

const CatalogRoute = ({ permissions, ...props }) => {
  const { permissions: userPermissions } = useContext(UserContext);
  const hasPermissions = hasPermission(userPermissions, permissions);

  return hasPermissions ? <Route {...props} /> : <UnauthorizedRedirect />;
};

CatalogRoute.propTypes = {
  permissions: PropTypes.arrayOf(PropTypes.string)
};

CatalogRoute.defaultProps = {
  permissions: []
};

export default CatalogRoute;
