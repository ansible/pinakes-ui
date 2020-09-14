/* eslint-disable react/prop-types */
import React from 'react';
import {
  Link,
  NavLink,
  useLocation,
  LinkProps,
  NavLinkProps
} from 'react-router-dom';
import styled from 'styled-components';
import { StringObject } from '../../types/common-types';

const StyledLink = styled(({ isDisabled, ...props }) => <Link {...props} />)`
  pointer-events: ${({ isDisabled }) => (isDisabled ? 'none' : 'initial')};
`;

const StyledNavLink = styled(({ isDisabled, ...props }) => (
  <NavLink {...props} />
))`
  pointer-events: ${({ isDisabled }) => (isDisabled ? 'none' : 'initial')};
`;

const createSearchQuery = (
  search: string,
  searchParams: StringObject,
  preserveSearch: boolean
): string => {
  const paramsQuery = Object.entries(searchParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  return preserveSearch
    ? `${search}${paramsQuery.length > 0 ? `&${paramsQuery}` : ''}`
    : paramsQuery.length > 0
    ? `?${paramsQuery}`
    : '';
};

export type CatalogLinkTo =
  | string
  | { pathname: string; search?: string; hash?: string };
export interface CatalogLinkProps
  extends Omit<LinkProps, 'to'>,
    Omit<NavLinkProps, 'to'> {
  pathname: string;
  searchParams?: StringObject;
  nav?: boolean;
  preserveSearch?: boolean;
  preserveHash?: boolean;
  showDivider?: boolean;
  to?: CatalogLinkTo;
}
const CatalogLink: React.ComponentType<CatalogLinkProps> = ({
  pathname,
  searchParams = {},
  nav = false,
  preserveSearch = false,
  preserveHash = false,
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
  return <Component {...props} to={to} />;
};

export default CatalogLink;
