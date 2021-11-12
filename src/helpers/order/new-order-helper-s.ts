// TODO migrate whole order-helper.js to TS
import catalogHistory from '../../routing/catalog-history';
import {
  Order,
  Portfolio,
  ProgressMessage
} from '@redhat-cloud-services/catalog-client';
import { Source } from '@redhat-cloud-services/sources-client';
import { getAxiosInstance } from '../shared/user-login';
import {
  CATALOG_API_BASE,
  CATALOG_INVENTORY_API_BASE
} from '../../utilities/constants';
import { OrderItem } from './order-helper-s';
const axiosInstance = getAxiosInstance();

export interface ObjectNotFound {
  object: 'Order item' | 'Product' | 'Portfolio' | 'Messages' | 'Platform';
  notFound: boolean;
}
export interface PortfolioItem {
  id?: string;
  favorite?: boolean;
  name?: string;
  description?: string | null;
  orphan?: boolean;
  state?: string;
  long_description?: string | null;
  distributor?: string | null;
  documentation_url?: string | null;
  support_url?: string | null;
  owner?: string;
  service_offering_source_ref?: string;
  service_offering_type?: string;
  portfolio?: string;
  icon_url?: string;
  created_at?: string;
  updated_at?: string;
  metadata?: any;
}

export type OrderDetailPayload = [
  Order,
  OrderItem | ObjectNotFound,
  PortfolioItem | ObjectNotFound,
  Source | ObjectNotFound,
  ProgressMessage | ObjectNotFound,
  Portfolio | ObjectNotFound
];

export type ProgressMessageItem = {
  orderItemId: string;
  progressMessages: ProgressMessage[];
};

export interface OrderProvisionPayload {
  orderItems: OrderItem[] | [];
  progressMessageItems: ProgressMessageItem[] | [];
}

export const fetchOrderDetailSequence = async (
  orderId: string
): Promise<OrderDetailPayload> => {
  let order: Order;
  try {
    order = await axiosInstance.get(`${CATALOG_API_BASE}/orders/${orderId}/`);
  } catch (error) {
    order = {};
    // @ts-ignore
    if (error.status === 404 || error.status === 400) {
      catalogHistory.replace({
        pathname: '/404',
        state: { from: catalogHistory.location }
      });
    } else {
      throw error;
    }
  }

  let orderItem: OrderItem | ObjectNotFound = {
    object: 'Order item',
    notFound: true
  };
  try {
    const orderItems = await axiosInstance.get(
      `${CATALOG_API_BASE}/order_items?order=${order.id}`
    );
    console.log('Debug - orderItems: ', orderItems);
    orderItem = orderItems.results[0];
  } catch (_error) {
    // no handler
  }

  let portfolioItem: PortfolioItem | ObjectNotFound = {
    object: 'Product',
    notFound: true
  };

  try {
    portfolioItem = await axiosInstance.get(
      `${CATALOG_API_BASE}/portfolio_items/${
        (orderItem as OrderItem).portfolio_item
      }`
    );
  } catch (_error) {
    // nohandler
  }

  console.log('Debug - portfolioItem: ', portfolioItem);
  const parallerRequests = [
    axiosInstance
      .get(
        `${CATALOG_INVENTORY_API_BASE}/sources/${
          (portfolioItem as PortfolioItem).service_offering_source_ref
        }`
      )
      .catch(() => ({ object: 'Platform', notFound: true })),

    axiosInstance
      .get(
        `${CATALOG_API_BASE}/order_items/${
          (orderItem as OrderItem).id
        }/progress_messages/`
      )
      .catch(() => ({ object: 'Messages', notFound: true })),
    axiosInstance
      .get(
        `${CATALOG_API_BASE}/portfolios/${
          (portfolioItem as PortfolioItem).portfolio
        }`
      )
      .catch(() => ({ object: 'Portfolio', notFound: true }))
  ];

  return Promise.all(
    parallerRequests
  ).then(([platform, progressMessages, portfolio]) => [
    order,
    orderItem,
    portfolioItem,
    platform as Source | ObjectNotFound,
    progressMessages as ProgressMessage | ObjectNotFound,
    portfolio as Portfolio | ObjectNotFound
  ]);
};

export const fetchOrderProvisionItems = async (
  orderId: string
): Promise<OrderProvisionPayload> => {
  let orderItems: OrderItem[];
  try {
    const items = await axiosInstance.get(
      `${CATALOG_API_BASE}/order_items/?order_id=${orderId}`
    );
    orderItems = items.data;
  } catch (error) {
    orderItems = [];
    // @ts-ignore
    if (error.status === 404 || error.status === 400) {
      catalogHistory.replace({
        pathname: '/404',
        state: { from: catalogHistory.location }
      });
    } else {
      throw error;
    }
  }

  const progressMessageItems: ProgressMessageItem[] = [];
  const promises = orderItems.map((orderItem) =>
    axiosInstance
      .get(`${CATALOG_API_BASE}/order_items/${orderItem.id}/progress_messages/`)
      .then((item) => {
        progressMessageItems.push({
          orderItemId: orderItem.id || '',
          progressMessages: item.data
        });
        return progressMessageItems;
      })
  );
  await Promise.all(promises);
  return { orderItems, progressMessageItems };
};
