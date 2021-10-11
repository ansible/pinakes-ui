/* eslint-disable react/prop-types */
import React, { ComponentType, useContext } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import UserContext from '../user-context';
import { hasPermission } from '../helpers/shared/helpers';
import { UnauthorizedRedirect } from '../smart-components/error-pages/error-redirects';
import { AnyObject } from '../types/common-types';

const ReidrectOnAccess: React.ComponentType<RouteProps> = (props) => (
  <Route {...props}>
    <UnauthorizedRedirect />
  </Route>
);

const hasCapability = (
  userCapabilities: AnyObject,
  requiredCapabilities?: string[] | string
) =>
  requiredCapabilities
    ? Array.isArray(requiredCapabilities)
      ? requiredCapabilities.some(
          (capability) => userCapabilities[capability] !== false
        )
      : userCapabilities[requiredCapabilities] !== false
    : true;

export interface CatalogRouteProps extends RouteProps {
  permissions?: string[];
  userCapabilities?: AnyObject;
  requiredCapabilities?: string | string[];
}
const CatalogRoute: ComponentType<CatalogRouteProps> = ({
  permissions = [],
  userCapabilities = {},
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

export default CatalogRoute;
