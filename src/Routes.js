import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import some from 'lodash/some';
import { AppPlaceholder } from './presentational-components/shared/loader-placeholders';
import Portfolio from './smart-components/portfolio/portfolio';

const Products = lazy(() => import('./smart-components/products/products'));
const Platforms = lazy(() => import('./smart-components/platform/platforms'));
const Portfolios = lazy(() =>
  import('./smart-components/portfolio/portfolios')
);
const Orders = lazy(() => import('./smart-components/order/orders'));

const paths = {
  products: '/products',
  platforms: '/platforms',
  portfolios: '/portfolios',
  portfolio: '/portfolio',
  orders: '/orders'
};

export const Routes = () => {
  const { pathname } = useLocation();
  return (
    <Suspense fallback={<AppPlaceholder />}>
      <Switch>
        <Route path={paths.products} component={Products} />
        <Route path={paths.portfolios} component={Portfolios} />
        <Route path={paths.portfolio} component={Portfolio} />
        <Route path={paths.platforms} component={Platforms} />
        <Route path={paths.orders} component={Orders} />
        <Route
          render={() =>
            some(paths, (p) => p === pathname) ? null : (
              <Redirect to={paths.portfolios} />
            )
          }
        />
      </Switch>
    </Suspense>
  );
};
