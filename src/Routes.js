import { Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { lazy, Suspense } from 'react';
import some from 'lodash/some';
import { AppPlaceholder } from './presentational-components/shared/loader-placeholders';

const Products = lazy(() => import('./smart-components/products/products'));
const Platforms = lazy(() => import('./smart-components/platform/platforms'));
const Portfolios = lazy(() => import('./smart-components/portfolio/portfolios'));
const Orders = lazy(() => import('./smart-components/order/orders'));

const paths = {
  products: '/products',
  platforms: '/platforms',
  portfolios: '/portfolios',
  portfolioItem: '/portfolios/:id',
  orders: '/orders'
};

export const Routes = props => {
  const path = props.childProps.location.pathname;
  return (
    <Suspense fallback={ <AppPlaceholder /> }>
      <Switch>
        <Route path={ paths.products } component={ Products }/>
        <Route path={ paths.portfolios } component={ Portfolios }/>
        <Route path={ paths.platforms } component={ Platforms }/>
        <Route path={ paths.orders } component={ Orders }/>
        { /* Finally, catch all unmatched routes */ }
        <Route render={ () => (some(paths, p => p === path) ? null : <Redirect to={ paths.portfolios } />) } />
      </Switch>
    </Suspense>
  );
};

Routes.propTypes = {
  childProps: PropTypes.object
};
