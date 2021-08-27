import * as React from 'react';
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router-dom';
import { PortfolioItems } from './smart-components/portfolio/portfolio-items';
import { PortfolioItem } from './smart-components/portfolio/portfolio-item';
import { Platforms } from './smart-components/platform/platforms';
import { Platform } from './smart-components/platform/platform';
import { Portfolios } from './smart-components/portfolio/portfolios';
import { Orders } from './smart-components/order/orders';
import { OrderDetail } from './smart-components/order/order-detail/order-detail';
import { OrderProcesses } from './smart-components/order-process/order-processes';

const Paths = {
  products: '/products',
  platforms: '/platforms',
  order_processes: '/order-processes',
  platform: '/platforms/platform',
  portfolios: PORTFOLIOS_ROUTE,
  portfolio: PORTFOLIO_ROUTE,
  orders: '/orders',
  order: ORDER_ROUTE
};

import {
  ORDER_ROUTE,
  PORTFOLIO_ROUTE,
  PORTFOLIOS_ROUTE
} from './constants/routes';
import { useEffect, useState } from 'react';

const AuthHandler = () => {
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    // check if the user is logged in, if not try login
  });
  const { Component, noAuth, ...props } = props;

  if (isLoading) {
    return null;
  }

  if (!noAuth) {
    return (
      <Redirect
        to={formatPath(Paths.login, {}, { next: props.location.pathname })}
      ></Redirect>
    );
  }

  return <Component {...props}></Component>;
};

export const Routes = () => {
  // Note: must be ordered from most specific to least specific
  const getRoutes = () => {
    return [
      { comp: Portfolios, path: Paths.portfolios },
      { comp: Portfolio, path: Paths.portfolio },
      { comp: PortfolioItems, path: Paths.portfolioItems },
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
      {this.getRoutes().map((route, index) => (
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
