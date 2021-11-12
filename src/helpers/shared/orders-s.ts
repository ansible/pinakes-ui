import { CATALOG_API_BASE } from '../../utilities/constants';
import { PortfolioItem } from '@redhat-cloud-services/catalog-client';
import { OrderDetail } from '../../redux/reducers/order-reducer';

export const getOrderIcon = ({ orderItems }: OrderDetail): string | undefined =>
  orderItems &&
  orderItems[0] &&
  `${CATALOG_API_BASE}/portfolio_items/${orderItems[0].portfolio_item_id}/icon`;

export const getOrderPortfolioName = (
  { orderItems, id }: OrderDetail,
  portfolioItems: PortfolioItem[]
): string => {
  const portfolioItem =
    orderItems &&
    orderItems[0] &&
    portfolioItems.find(({ id }) => orderItems[0].portfolio_item_id === id);
  return portfolioItem ? portfolioItem.name : `Order ${id}`;
};

export const getOrderPlatformId = (
  { orderItems }: OrderDetail,
  portfolioItems: PortfolioItem[]
): {
  orderPlatform?: string;
  orderPortfolio?: string;
} => {
  const portfolioItem =
    orderItems &&
    orderItems[0] &&
    portfolioItems.find(({ id }) => orderItems[0].portfolio_item_id === id);
  return portfolioItem
    ? {
        orderPlatform: portfolioItem.service_offering_source_ref,
        orderPortfolio: portfolioItem.portfolio_id
      }
    : {};
};
