import { Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { lazy, Suspense } from 'react';
import some from 'lodash/some';
import { AppPlaceholder } from './presentational-components/shared/loader-placeholders';

const Platforms = lazy(() => import('./smart-components/platform/platforms'));
const Portfolios = lazy(() => import('./smart-components/portfolio/portfolios'));
const Orders = lazy(() => import('./smart-components/order/orders'));

const paths = {
  platforms: '/platforms',
  portfolios: '/portfolios',
  portfolioItem: '/portfolios/:id',
  orders: '/orders'
};

const InsightsRoute = ({ rootClass, ...rest }) => {
  const root = document.getElementById('root');
  root.removeAttribute('class');
  root.classList.add(`page__${rootClass}`, 'pf-l-page__main', 'pf-c-page__main');
  root.setAttribute('role', 'main');
  return (<Route { ...rest } />);
};

InsightsRoute.propTypes = {
  rootClass: PropTypes.string
};

export const Routes = props => {
  const path = props.childProps.location.pathname;
  return (
    <Suspense fallback={ <AppPlaceholder /> }>
      <Switch>
        <InsightsRoute path={ paths.portfolios } component={ Portfolios } rootClass="portfolios" />
        <InsightsRoute path={ paths.platforms } component={ Platforms } rootClass="platforms"/>
        <InsightsRoute path={ paths.orders } component={ Orders } rootClass="catalog" />
        { /* Finally, catch all unmatched routes */ }
        <Route render={ () => (some(paths, p => p === path) ? null : <Redirect to={ paths.portfolios } />) } />
      </Switch>
    </Suspense>
  );
};

Routes.propTypes = {
  childProps: PropTypes.object
};
