import React from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';

const patternsReducers = {
  portfolios: 'portfolioReducer.selectedPortfolio.name',
  platforms: 'platformReducer.selectedPlatform.name',
  orders: 'ordersReducer'
};

const fragmentMapper = {
  portfolios: {
    title: 'Portfolios'
  },
  detail: {
    attribute: 'name'
  },
  'add-products': {
    title: 'Add products'
  },
  'remove-products': {
    title: 'Remove products'
  },
  platforms: {
    title: 'Platforms'
  },
  orders: {
    title: 'Orders'
  }
};

const createPaths = fragments => {
  const rootReducer = fragments.find(({ reducer }) => reducer !== undefined).reducer;
  let finalFragments = [];
  let fragmentIndex = 0;
  fragments.forEach(({ reducer, isId, urlFragment }) => {
    if (isId) {
      finalFragments[fragmentIndex - 1] = {
        ...finalFragments[fragmentIndex - 1],
        path: `${finalFragments[fragmentIndex - 1].path}/${urlFragment}`
      };
      finalFragments = [
        ...finalFragments.slice(0, fragmentIndex),
        ...finalFragments.slice(fragmentIndex + 1)
      ];
    } else {
      finalFragments[fragmentIndex] = {
        reducer: reducer || rootReducer,
        path: fragmentIndex === 0 ? `/${urlFragment}` : `${finalFragments[fragmentIndex - 1].path}/${urlFragment}`,
        urlFragment
      };
      fragmentIndex++;
    }
  });
  return finalFragments;
};

const findRoutes = (url) => {
  const fragments = (url.split('/')).filter(item => item !== '');
  const cleanFragments = fragments.map((key, index) => {
    return {
      reducer: patternsReducers[key],
      urlFragment: key,
      index,
      isId: !!key.match(/^[0-9]+$/)
    };
  });

  if (cleanFragments.length === 0) {
    return [];
  }

  return createPaths(cleanFragments).map(fragment => ({
    ...fragment,
    meta: fragmentMapper[Object.keys(fragmentMapper).find(key => fragment.urlFragment.includes(key))]
  }));
};

const CatalogBreadrubms = ({ match: { url }, location: { pathname }, reducers }) => {
  const routes = findRoutes(url);
  const items = routes.map((route, index) => (
    <BreadcrumbItem key={ route.path } isActive={ route.path === pathname || index === routes.length - 1 }>
      <NavLink exact to={ route.path }>
        { route.meta.title || get(reducers, route.reducer) }
      </NavLink>
    </BreadcrumbItem>
  ));
  return (
    <Breadcrumb>
      { items }
    </Breadcrumb>
  );
};

const mapStateToProps = state => ({
  reducers: { ...state }
});

CatalogBreadrubms.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }),
  reducers: PropTypes.object
};

export default withRouter(connect(mapStateToProps)(CatalogBreadrubms));
