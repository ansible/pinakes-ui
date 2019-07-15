import { CATALOG_API_BASE } from '../../utilities/constants';
import { defaultPlatformIcon } from '../../helpers/shared/platform';

export const getOrderIcon = ({ orderItems }) => orderItems[0] && `${CATALOG_API_BASE}/portfolio_items/${orderItems[0].portfolio_item_id}/icon`;

export const getOrderPortfolioName = ({ orderItems, id }, portfolioItems) => {
  const portfolioItem = orderItems[0] && portfolioItems.find(({ id }) => orderItems[0].portfolio_item_id === id);
  return portfolioItem ? portfolioItem.display_name || portfolioItem.name : `Order ${id}`;
};

export const getOrderPlatformIcon = ({ orderItems }, portfolioItems) => {
  const portfolioItem = orderItems[0] && portfolioItems.find(({ id }) => orderItems[0].portfolio_item_id === id);
  return defaultPlatformIcon(portfolioItem && portfolioItem.platformId);
};

