import React from 'react';
import PropTypes from 'prop-types';
import CatalogLink from '../../smart-components/common/catalog-link';

const ConditionalLink = ({ children, pathname, ...props }) =>
  pathname ? (
    <CatalogLink pathname={pathname} {...props}>
      {children}
    </CatalogLink>
  ) : (
    children
  );

ConditionalLink.propTypes = {
  pathname: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]).isRequired
};

export default ConditionalLink;
