import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PortfolioItems from '../../smart-components/portfolio/portfolio-items';
import Platforms from '../../smart-components/platform/platforms';
import Platform from '../../smart-components/platform/platform';
import Portfolios from '../../smart-components/portfolio/portfolios';
import Orders from '../../smart-components/order/orders';
import OrderDetail from '../../smart-components/order/order-detail/order-detail';
import OrderProcesses from '../../smart-components/order-process/order-processes';
import {
  ORDER_ROUTE,
  PORTFOLIO_ROUTE,
  PORTFOLIOS_ROUTE
} from '../../constants/routes';

import { useEffect, useState } from 'react';
import Portfolio from '../../smart-components/portfolio/portfolio';
import LoginPage from './login/login';

export const Paths = {
  products: '/products',
  platforms: '/platforms',
  order_processes: '/order-processes',
  platform: '/platforms/platform',
  portfolios: PORTFOLIOS_ROUTE,
  portfolio: PORTFOLIO_ROUTE,
  orders: '/orders',
  order: ORDER_ROUTE
};

const getQueryString = (params) => {
  const paramString = [];
  for (const key of Object.keys(params)) {
    if (Array.isArray(params[key])) {
      for (const val of params[key]) {
        paramString.push(key + '=' + encodeURIComponent(val));
      }
    } else {
      paramString.push(key + '=' + encodeURIComponent(params[key]));
    }
  }

  return paramString.join('&');
};

export function formatPath(path, data, params = {}) {
  let url = path;

  for (const k of Object.keys(data)) {
    url = url.replace(':' + k + '+', data[k]).replace(':' + k, data[k]);
  }

  if (params) {
    return `${url}?${getQueryString(params)}`;
  } else {
    return url;
  }
}

const AuthHandler = (params) => {
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    // check if the user is logged in, if not try login
  });
  let { Component, noAuth, ...props } = params;

  if (isLoading) {
    return null;
  }

  //TODO - remove after auth handling
  noAuth = true;
  if (!noAuth) {
    return (
      <Redirect to={formatPath(Paths.login, {}, { next: location.pathname })} />
    );
  }

  return <Component {...props} />;
};

export const Routes = () => {
  // Note: must be ordered from most specific to least specific
  const getRoutes = () => {
    return [
      { comp: Portfolios, path: Paths.portfolios },
      { comp: Portfolio, path: Paths.portfolio },
      { comp: PortfolioItems, path: Paths.products },
      { comp: Platforms, path: Paths.platforms },
      { comp: Platform, path: Paths.platform },
      { comp: Orders, path: Paths.orders },
      { comp: OrderDetail, path: Paths.orderDetail },
      { comp: OrderProcesses, path: Paths.orderProcesses },
      { comp: LoginPage, path: Paths.login, noAuth: true }
    ];
  };

  return (
    <Switch>
      {getRoutes().map((route, index) => (
        <Route
          key={index}
          render={(props) => (
            <AuthHandler
              noAuth={route.noAuth}
              Component={route.comp}
              {...props}
            />
          )}
          path={route.path}
        />
      ))}
    </Switch>
  );
};
