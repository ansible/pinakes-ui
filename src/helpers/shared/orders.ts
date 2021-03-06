import { CATALOG_API_BASE } from '../../utilities/constants';
import { PortfolioItem } from '@redhat-cloud-services/catalog-client';
import { OrderDetail } from '../../redux/reducers/order-reducer';

export const getOrderIcon = (orderDetail: OrderDetail): string | undefined => {
  if (localStorage.getItem('catalog_standalone')) {
    const orderItem =
      orderDetail?.extra_data?.order_items &&
      orderDetail?.extra_data?.order_items[0];
    return orderItem?.extra_data?.portfolio_item?.icon_url;
  } else {
    const { orderItems } = orderDetail;
    return (
      orderItems &&
      orderItems[0] &&
      `${CATALOG_API_BASE}/portfolio_items/${orderItems[0].portfolio_item_id}/icon`
    );
  }
};

const getIOrderPortfolioName = (
  { orderItems, id }: OrderDetail,
  portfolioItems: PortfolioItem[]
): string => {
  const portfolioItem =
    orderItems[0] &&
    portfolioItems.find(({ id }) => orderItems[0].portfolio_item_id === id);
  return portfolioItem ? portfolioItem.name : `Order ${id}`;
};

const getSOrderPortfolioName = (order: OrderDetail): string => {
  const orderItem = order?.extra_data?.order_items[0];
  const portfolioItem = orderItem?.extra_data.portfolio_item;
  return portfolioItem ? portfolioItem.name : `Order ${order.id}`;
};

export const getOrderPortfolioName = (
  order: OrderDetail,
  portfolioItems: PortfolioItem[]
): string =>
  localStorage.getItem('catalog_standalone')
    ? getSOrderPortfolioName(order)
    : getIOrderPortfolioName(order, portfolioItems);

const getIOrderPlatformId = (
  { orderItems }: OrderDetail,
  portfolioItems: PortfolioItem[]
): {
  orderPlatform?: string;
  orderPortfolio?: string;
} => {
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

const getSOrderPlatformId = (
  order: OrderDetail
): {
  orderPlatform?: string;
  orderPortfolio?: string;
} => {
  const orderItem = order?.extra_data?.order_items[0];
  const portfolioItem = orderItem?.extra_data.portfolio_item;
  return portfolioItem
    ? {
        orderPlatform: portfolioItem.service_offering_source_ref,
        orderPortfolio: portfolioItem.portfolio_id
      }
    : {};
};

export const getOrderPlatformId = (
  order: OrderDetail,
  portfolioItems: PortfolioItem[]
): {
  orderPlatform?: string;
  orderPortfolio?: string;
} =>
  localStorage.getItem('catalog_standalone')
    ? getSOrderPlatformId(order)
    : getIOrderPlatformId(order, portfolioItems);
