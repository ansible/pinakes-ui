import React from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const StyledLink = styled(({ isDisabled, ...props }) => <Link {...props} />)`
  pointer-events: ${({ isDisabled }) => (isDisabled ? 'none' : 'initial')};
`;

const StyledNavLink = styled(({ isDisabled, ...props }) => (
  <NavLink {...props} />
))`
  pointer-events: ${({ isDisabled }) => (isDisabled ? 'none' : 'initial')};
`;

const createSearchQuery = (search, searchParams, preserveSearch) => {
  const paramsQuery = Object.entries(searchParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  return preserveSearch
    ? `${search}${paramsQuery.length > 0 ? `&${paramsQuery}` : ''}`
    : paramsQuery.length > 0
    ? `?${paramsQuery}`
    : '';
};

const CatalogLink = ({
  pathname,
  searchParams,
  nav,
  preserveSearch,
  preserveHash,
  showDivider,
  ...props
}) => {
  const { search, hash } = useLocation();
  const Component = nav ? StyledNavLink : StyledLink;
  const to = {
    pathname,
    search: createSearchQuery(search, searchParams, preserveSearch),
    hash: preserveHash ? hash : undefined
  };
  return <Component to={to} {...props} />;
};

CatalogLink.propTypes = {
  pathname: PropTypes.string.isRequired,
  searchParams: PropTypes.shape({
    [PropTypes.string]: PropTypes.string
  }),
  nav: PropTypes.bool,
  preserveSearch: PropTypes.bool,
  preserveHash: PropTypes.bool,
  showDivider: PropTypes.any // this has to be removed from the spread props. This is PF internal prop which is forced on breadcrumbs child
};

CatalogLink.defaultProps = {
  nav: false,
  preserveSearch: false,
  searchParams: {},
  preserveHash: false
};

export default CatalogLink;
