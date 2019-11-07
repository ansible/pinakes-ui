import React from 'react';
import get from 'lodash/get';
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
  detail: {},
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
  },
  product: {
    reducer: 'portfolioReducer.portfolioItem.name'
  }
};

const createPaths = fragments => {
  let rootReducer = fragments.find(({ reducer }) => reducer !== undefined);
  let finalFragments = [];
  if (!rootReducer) {
    return finalFragments;
  } else {
    rootReducer = rootReducer.reducer;
  }

  let fragmentIndex = 0;
  fragments.forEach(({ isId, urlFragment }) => {
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
        reducer: fragmentMapper[urlFragment].reducer || rootReducer,
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

const CatalogBreadrubms = ({ match: { url }, reducers }) => {
  const routes = findRoutes(url);
  const items = routes.map((route, index) => (
    <BreadcrumbItem key={ route.path } isActive={ route.path === url || index === routes.length - 1 }>
      <NavLink exact to={ route.path } isActive={ () => route.path === url || index === routes.length - 1 }>
        { route.meta.title || get(reducers, route.reducer) }
      </NavLink>
    </BreadcrumbItem>
  ));
  return (
    <Breadcrumb style={ { minHeight: 18 } }>
      { items.length > 1 && items }
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
  reducers: PropTypes.object
};

export default withRouter(connect(mapStateToProps)(CatalogBreadrubms));
