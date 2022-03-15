import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import some from 'lodash/some';
import { AppPlaceholder } from '../../presentational-components/shared/loader-placeholders';
import { Paths, errorPaths } from '../../constants/routes';
import CatalogRoute from '../../routing/catalog-route-s';
import DialogRoutes from '../../smart-components/dialog-routes';

const CommonApiError = lazy(() =>
  import(
    /* webpackChunkName: "error-page" */ '../../smart-components/error-pages/common-api-error'
  )
);

const Products = lazy(() =>
  import(
    /* webpackChunkName: "products" */ '../../smart-components/products/products'
  )
);
const Platforms = lazy(() =>
  import(
    /* webpackChunkName: "platforms" */ '../../smart-components/platform/platforms'
  )
);
const Platform = lazy(() =>
  import(
    /* webpackChunkName: "platform" */ '../../smart-components/platform/platform'
  )
);
const Portfolios = lazy(() =>
  import(
    /* webpackChunkName: "portfolios" */ '../../smart-components/portfolio/portfolios'
  )
);
const Portfolio = lazy(() =>
  import(
    /* webpackChunkName: "portfolio" */ '../../smart-components/portfolio/portfolio'
  )
);
const Orders = lazy(() =>
  import(/* webpackChunkName: "orders" */ '../../smart-components/order/orders')
);
const OrderDetail = lazy(() =>
  import(
    /* webpackChunkName: "order-detail" */ '../../smart-components/order/order-detail/order-detail'
  )
);

export const Routes = () => {
  const { pathname } = useLocation();
  return (
    <Suspense fallback={<AppPlaceholder />}>
      <Switch>
        <CatalogRoute path={Paths.products} component={Products} />
        <CatalogRoute path={Paths.portfolio} component={Portfolio} />
        <CatalogRoute path={Paths.portfolios} component={Portfolios} />
        <CatalogRoute
          permissions={['catalog:portfolios:create']}
          path={Paths.platform}
          component={Platform}
        />
        <CatalogRoute
          permissions={['catalog:portfolios:create']}
          path={Paths.platforms}
          component={Platforms}
        />
        <CatalogRoute path={Paths.order} component={OrderDetail} />
        <CatalogRoute path={Paths.orders} component={Orders} />
        <Route path={errorPaths} component={CommonApiError} />
        <Route
          render={() =>
            some(Paths, (p) => p === pathname) ? null : (
              <Redirect to={Paths.portfolios} />
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
