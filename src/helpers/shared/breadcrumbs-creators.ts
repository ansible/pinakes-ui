import {
  PORTFOLIOS_ROUTE,
  PORTFOLIO_ROUTE,
  PORTFOLIO_ITEM_ROUTE,
  ORDER_ROUTE,
  PLATFORM_ROUTE,
  PLATFORM_SERVICE_OFFERINGS_ROUTE,
  PLATFORMS_ROUTE,
  ORDERS_ROUTE,
  EDIT_SURVEY_ROUTE,
  ADD_PRODUCTS_ROUTE,
  PORTFOLIO_ITEM_ROUTE_EDIT, PLATFORM_TEMPLATES_ROUTE, PLATFORM_INVENTORIES_ROUTE, PLATFORM_DETAILS_ROUTE
} from '../../constants/routes';
import { PortfolioReducerState } from '../../redux/reducers/portfolio-reducer';
import { ReactNode } from 'react';
import { PlatformReducerState } from '../../redux/reducers/platform-reducer';
import { OrderReducerState } from '../../redux/reducers/order-reducer';

export const BASE_PORTFOLIO_FRAGMENTS = [
  {
    title: 'Portfolios',
    pathname: PORTFOLIOS_ROUTE,
    searchParams: {}
  }
];

export const ENTITIES_EXTRA_PARAMS = {
  'portfolio-item': ['source']
};

export const FRAGMENT_TITLE = {
  ['/portfolio']: (
    getState: () => { portfolioReducer: PortfolioReducerState }
  ): ReactNode => getState().portfolioReducer.selectedPortfolio.name,
  ['/portfolio/portfolio-item']: (
    getState: () => { portfolioReducer: PortfolioReducerState }
  ): ReactNode => getState().portfolioReducer.portfolioItem.portfolioItem.name,
  [EDIT_SURVEY_ROUTE]: (): string => 'Edit survey',
  [ADD_PRODUCTS_ROUTE]: (): string => 'Add products',
  ['/platform']: (
    getState: () => { platformReducer: PlatformReducerState }
  ): ReactNode => getState().platformReducer.selectedPlatform.name,
  ['/platform/platform-templates']: (
    getState: () => { platformReducer: PlatformReducerState }
  ): ReactNode => getState().platformReducer.selectedPlatform.name,
  ['/platform/platform-inventories']: (
    getState: () => { platformReducer: PlatformReducerState }
  ): ReactNode => getState().platformReducer.selectedPlatform.name,
  ['/platform/platform-details']: (
    getState: () => { platformReducer: PlatformReducerState }
  ): ReactNode => getState().platformReducer.selectedPlatform.name,

  [PLATFORM_SERVICE_OFFERINGS_ROUTE]: (
    getState: () => { platformReducer: PlatformReducerState }
  ): ReactNode => getState().platformReducer.serviceOffering.service.name,
  [ORDER_ROUTE]: (
    getState: () => { orderReducer: OrderReducerState }
  ): ReactNode => {
    const { portfolioItem, order } = getState().orderReducer.orderDetail;
    return `${portfolioItem.name} # ${order.id}`;
  },
  [PORTFOLIO_ITEM_ROUTE_EDIT]: (): string => 'Edit product'
};

export const FRAGMENT_PREFIX = {
  [PORTFOLIO_ROUTE]: {
    pathname: PORTFOLIOS_ROUTE,
    title: 'Portfolios',
    searchParams: {}
  },
  [PLATFORM_ROUTE]: {
    pathname: PLATFORMS_ROUTE,
    title: 'Platforms',
    searchParams: {}
  },
  [PLATFORM_TEMPLATES_ROUTE]: {
    pathname: PLATFORMS_ROUTE,
    title: 'Platforms',
    searchParams: {}
  },
  [PLATFORM_INVENTORIES_ROUTE]: {
    pathname: PLATFORMS_ROUTE,
    title: 'Platforms',
    searchParams: {}
  },
  [PLATFORM_DETAILS_ROUTE]: {
    pathname: PLATFORMS_ROUTE,
    title: 'Platforms',
    searchParams: {}
  },
  [ORDER_ROUTE]: {
    pathname: ORDERS_ROUTE,
    title: 'Orders',
    searchParams: {}
  }
};
