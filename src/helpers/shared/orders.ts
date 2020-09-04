import { CATALOG_API_BASE } from '../../utilities/constants';
import {
  OrderItem,
  PortfolioItem
} from '@redhat-cloud-services/catalog-client';
import { Full } from '../../types/common-types';

export const getOrderIcon = ({
  orderItems
}: {
  orderItems: OrderItem[];
}): string | undefined =>
  orderItems[0] &&
  `${CATALOG_API_BASE}/portfolio_items/${orderItems[0].portfolio_item_id}/icon`;

export const getOrderPortfolioName = (
  { orderItems, id }: { orderItems: OrderItem[]; id: string },
  portfolioItems: Full<PortfolioItem>[]
): string => {
  const portfolioItem =
    orderItems[0] &&
    portfolioItems.find(({ id }) => orderItems[0].portfolio_item_id === id);
  return portfolioItem ? portfolioItem.name : `Order ${id}`;
};

export const getOrderPlatformId = (
  { orderItems }: { orderItems: OrderItem[] },
  portfolioItems: Full<PortfolioItem>[]
):
  | {
      orderPlatform: string;
      orderPortfolio: string;
    }
  | Record<string, unknown> => {
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
