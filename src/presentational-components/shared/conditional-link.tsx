/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import CatalogLink, {
  CatalogLinkProps
} from '../../smart-components/common/catalog-link';

export interface ConditionalLinkProps
  extends Omit<CatalogLinkProps, 'pathname'> {
  pathname?: string;
}
const ConditionalLink: React.ComponentType<ConditionalLinkProps> = ({
  children,
  pathname,
  ...props
}) => (
  <Fragment>
    {pathname ? (
      <CatalogLink pathname={pathname} {...props}>
        {children}
      </CatalogLink>
    ) : (
      children
    )}
  </Fragment>
);

export default ConditionalLink;
