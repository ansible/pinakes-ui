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
import DialogRoutes from './smart-components/dialog-routes';
import { loadComponent, useDynamicScript } from './utilities/dynamic-loader';
const CommonApiError = lazy(() =>
  import(
    /* webpackChunkName: "error-page" */ './smart-components/error-pages/common-api-error'
  )
);

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
const OrderProcesses = lazy(() =>
  import(
    /* webpackChunkName: "order-processes" */ './smart-components/order-process/order-processes'
  )
);

const url = '/apps/approval/fed-mods.json';

// eslint-disable-next-line react/prop-types
const ApprovalComponent = () => {
  const { ready, failed } = useDynamicScript({
    url
  });
  if (!ready) {
    return <h2>Loading dynamic script: {url}</h2>;
  }

  if (failed) {
    return <h2>Failed to load dynamic script: {url}</h2>;
  }

  const Component = React.lazy(loadComponent('approval', 'Approval#./RootApp'));

  return (
    <React.Suspense fallback="Loading">
      <Component />
    </React.Suspense>
  );
};

const paths = {
  products: '/products',
  platforms: '/platforms',
  order_processes: '/order-processes',
  platform: '/platforms/platform',
  portfolios: PORTFOLIOS_ROUTE,
  portfolio: PORTFOLIO_ROUTE,
  orders: '/orders',
  order: ORDER_ROUTE,
  approval: '/approval'
};

const errorPaths = ['/400', '/401', '/403', '/404'];

export const Routes = () => {
  const { pathname } = useLocation();
  return (
    <Suspense fallback={<AppPlaceholder />}>
      <Switch>
        <CatalogRoute path={paths.products} component={Products} />
        <CatalogRoute path={paths.portfolio} component={Portfolio} />
        <CatalogRoute path={paths.portfolios} component={Portfolios} />
        <CatalogRoute
          permissions={['catalog:portfolios:create']}
          path={paths.platform}
          component={Platform}
        />
        <CatalogRoute
          permissions={['catalog:portfolios:create']}
          path={paths.platforms}
          component={Platforms}
        />
        <CatalogRoute path={paths.order_processes} component={OrderProcesses} />
        <CatalogRoute path={paths.order} component={OrderDetail} />
        <CatalogRoute path={paths.orders} component={Orders} />
        <Route path={errorPaths} component={CommonApiError} />
        <Route
          render={() =>
            some(paths, (p) => p === pathname) ? null : (
              <Redirect to={paths.portfolios} />
            )
          }
        />
      </Switch>
      {/*
       * We require the empty DIV around the dialog routes to avoid testing issues
       * It does not have any visual effect on the application
       * Emzyme simply cannot handle direct descendant of Suspense to be another Suspense
       */}
      <div>
        <DialogRoutes />
      </div>
    </Suspense>
  );
};
