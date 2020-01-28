export const BASE_PORTFOLIO_FRAGMENTS = [
  {
    title: 'Portfolios',
    pathname: '/portfolios',
    searchParams: {}
  }
];

export const ENTITIES_EXTRA_PARAMS = {
  'portfolio-item': ['source']
};

export const FRAGMENT_TITLE = {
  '/portfolio': (getState) =>
    getState().portfolioReducer.selectedPortfolio.name,
  '/portfolio/portfolio-item': (getState) =>
    getState().portfolioReducer.portfolioItem.portfolioItem.name,
  '/portfolio/portfolio-item/edit-survey': () => 'Edit survey',
  '/portfolio/portfolio-item/add-products': () => 'Add products',
  '/platform': (getState) => getState().platformReducer.selectedPlatform.name,
  '/platform/platform-templates': () => 'Templates',
  '/platform/platform-inventories': () => 'Inventories',
  '/platform/service-offerings': (getState) =>
    getState().platformReducer.serviceOffering.service.name,
  '/order': (getState) => {
    const { portfolioItem, order } = getState().orderReducer.orderDetail;
    return `${portfolioItem.name} # ${order.id}`;
  }
};

export const FRAGMENT_PREFIX = {
  '/portfolio': {
    pathname: '/portfolios',
    title: 'Portfolios',
    searchParams: {}
  },
  '/platform': {
    pathname: '/platforms',
    title: 'Platforms',
    searchParams: {}
  },
  '/order': {
    pathname: '/orders',
    title: 'Orders',
    searchParams: {}
  }
};
