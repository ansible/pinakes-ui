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
  PORTFOLIO_ITEM_ROUTE_EDIT
} from '../../constants/routes';

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
  [PORTFOLIO_ROUTE]: (getState) =>
    getState().portfolioReducer.selectedPortfolio.name,
  [PORTFOLIO_ITEM_ROUTE]: (getState) =>
    getState().portfolioReducer.portfolioItem.portfolioItem.name,
  [EDIT_SURVEY_ROUTE]: () => 'Edit survey',
  [ADD_PRODUCTS_ROUTE]: () => 'Add products',
  [PLATFORM_ROUTE]: (getState) =>
    getState().platformReducer.selectedPlatform.name,
  [PLATFORM_SERVICE_OFFERINGS_ROUTE]: (getState) =>
    getState().platformReducer.serviceOffering.service.name,
  [ORDER_ROUTE]: (getState) => {
    const { portfolioItem, order } = getState().orderReducer.orderDetail;
    return `${portfolioItem.name} # ${order.id}`;
  },
  [PORTFOLIO_ITEM_ROUTE_EDIT]: () => 'Edit product'
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
  [ORDER_ROUTE]: {
    pathname: ORDERS_ROUTE,
    title: 'Orders',
    searchParams: {}
  }
};
