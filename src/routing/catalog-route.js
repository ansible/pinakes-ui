import React, { useContext } from 'react';
import { Route } from 'react-router-dom';
import UserContext from '../user-context';
import PropTypes from 'prop-types';
import { hasPermission } from '../helpers/shared/helpers';
import { UnauthorizedRedirect } from '../smart-components/error-pages/error-redirects';

const resolveCapability = (userCapabilities, requiredCapabilities) =>
  Array.isArray(requiredCapabilities)
    ? requiredCapabilities.some((capability) => userCapabilities[capability])
    : userCapabilities[requiredCapabilities];

const CatalogRoute = ({
  permissions,
  userCapabilities,
  requiredCapabilities,
  ...props
}) => {
  const { permissions: userPermissions } = useContext(UserContext);

  if (
    requiredCapabilities &&
    !resolveCapability(userCapabilities, requiredCapabilities)
  ) {
    return <UnauthorizedRedirect />;
  }

  const hasPermissions = hasPermission(userPermissions, permissions);

  return hasPermissions ? <Route {...props} /> : <UnauthorizedRedirect />;
};

CatalogRoute.propTypes = {
  permissions: PropTypes.arrayOf(PropTypes.string),
  userCapabilities: PropTypes.object,
  requiredCapabilities: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ])
};

CatalogRoute.defaultProps = {
  permissions: [],
  userCapabilities: {}
};

export default CatalogRoute;
