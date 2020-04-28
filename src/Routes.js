import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import some from 'lodash/some';
import { AppPlaceholder } from './presentational-components/shared/loader-placeholders';
import {
  PORTFOLIOS_ROUTE,
  PORTFOLIO_ROUTE,
  ORDER_ROUTE
} from './constants/routes';
import CatalogRoute from './routing/catalog-route';
import CommonApiError from './smart-components/error-pages/common-api-error';

const Products = lazy(() =>
  import(
    /* webpackChunkName: "products" */ './smart-components/products/products'
  )
);
const Platforms = lazy(() =>
  import(
    /* webpackChunkName: "platforms" */ './smart-components/platform/platforms'
  )
);
const Platform = lazy(() =>
  import(
    /* webpackChunkName: "platform" */ './smart-components/platform/platform'
  )
);
const Portfolios = lazy(() =>
  import(
    /* webpackChunkName: "portfolios" */ './smart-components/portfolio/portfolios'
  )
);
const Portfolio = lazy(() =>
  import(
    /* webpackChunkName: "portfolio" */ './smart-components/portfolio/portfolio'
  )
);
const Orders = lazy(() =>
  import(/* webpackChunkName: "orders" */ './smart-components/order/orders')
);
const OrderDetail = lazy(() =>
  import(
    /* webpackChunkName: "order-detail" */ './smart-components/order/order-detail/order-detail'
  )
);

const paths = {
  products: '/products',
  platforms: '/platforms',
  platform: '/platform',
  portfolios: PORTFOLIOS_ROUTE,
  portfolio: PORTFOLIO_ROUTE,
  orders: '/orders',
  order: ORDER_ROUTE
};

const errorPaths = ['/400', '/401', '/403', '/404'];

export const Routes = () => {
  const { pathname } = useLocation();
  return (
    <Suspense fallback={<AppPlaceholder />}>
      <Switch>
        <CatalogRoute path={paths.products} component={Products} />
        <CatalogRoute path={paths.portfolios} component={Portfolios} />
        <CatalogRoute path={paths.portfolio} component={Portfolio} />
        <CatalogRoute
          permissions={['catalog:portfolios:create']}
          path={paths.platforms}
          component={Platforms}
        />
        <CatalogRoute
          permissions={['catalog:portfolios:create']}
          path={paths.platform}
          component={Platform}
        />
        <CatalogRoute path={paths.orders} component={Orders} />
        <CatalogRoute path={paths.order} component={OrderDetail} />
        <Route path={errorPaths} component={CommonApiError} />
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
