import { CATALOG_API_BASE } from '../../utilities/constants';

export const getOrderIcon = ({ orderItems }) =>
  orderItems[0] &&
  `${CATALOG_API_BASE}/portfolio_items/${orderItems[0].portfolio_item_id}/icon`;

export const getOrderPortfolioName = ({ orderItems, id }, portfolioItems) => {
  const portfolioItem =
    orderItems[0] &&
    portfolioItems.find(({ id }) => orderItems[0].portfolio_item_id === id);
  return portfolioItem ? portfolioItem.name : `Order ${id}`;
};

export const getOrderPlatformId = ({ orderItems }, portfolioItems) => {
  const portfolioItem =
    orderItems[0] &&
    portfolioItems.find(({ id }) => orderItems[0].portfolio_item_id === id);
  return portfolioItem
    ? {
        orderPlatform: portfolioItem.service_offering_source_ref,
        orderPortfolio: portfolioItem.portfolio_id
      }
    : {};
};
