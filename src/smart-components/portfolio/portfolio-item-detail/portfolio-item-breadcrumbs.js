import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, useLocation } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';

const PortfolioItemBreadcrumbs = ({ portfolio, portfolioItem, search }) => {
  const location = useLocation();
  const editLeaf = location.pathname.split('/').pop() === 'edit-survey';
  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <NavLink exact to="/portfolios">
          Portfolios
        </NavLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <NavLink exact to={`/portfolios/detail/${portfolio.id}`}>
          {portfolio.name}
        </NavLink>
      </BreadcrumbItem>
      <BreadcrumbItem isActive={!editLeaf}>
        <NavLink
          exact
          activeClassName="breadcrumb-active"
          to={{
            pathname: `/portfolios/detail/${portfolio.id}/product/${portfolioItem.id}`,
            search
          }}
        >
          {portfolioItem.name}
        </NavLink>
      </BreadcrumbItem>
      {editLeaf && (
        <BreadcrumbItem isActive>
          <NavLink
            exact
            activeClassName="breadcrumb-active"
            to={{
              pathname: `/portfolios/detail/${portfolio.id}/product/${portfolioItem.id}/edit-survey`,
              search
            }}
          >
            Edit survey
          </NavLink>
        </BreadcrumbItem>
      )}
    </Breadcrumb>
  );
};

PortfolioItemBreadcrumbs.propTypes = {
  portfolio: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  portfolioItem: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  search: PropTypes.string.isRequired
};

export default PortfolioItemBreadcrumbs;
