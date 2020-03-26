import React, { useContext } from 'react';
import { Route } from 'react-router-dom';
import UserContext from '../user-context';
import PropTypes from 'prop-types';
import { hasPermission } from '../helpers/shared/helpers';
import { UnauthorizedRedirect } from '../smart-components/error-pages/error-redirects';

const ReidrectOnAccess = (props) => (
  <Route {...props}>
    <UnauthorizedRedirect />
  </Route>
);

const hasCapability = (userCapabilities, requiredCapabilities) =>
  requiredCapabilities
    ? Array.isArray(requiredCapabilities)
      ? requiredCapabilities.some(
          (capability) => userCapabilities[capability] !== false
        )
      : userCapabilities[requiredCapabilities] !== false
    : true;

const CatalogRoute = ({
  permissions,
  userCapabilities,
  requiredCapabilities,
  ...props
}) => {
  const { permissions: userPermissions } = useContext(UserContext);
  const hasAccess =
    hasCapability(userCapabilities, requiredCapabilities) &&
    hasPermission(userPermissions, permissions);

  if (!hasAccess) {
    return <ReidrectOnAccess {...props} />;
  }

  return <Route {...props} />;
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
