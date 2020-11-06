// TODO migrate whole order-helper.js to TS
import catalogHistory from '../../routing/catalog-history';
import {
  Order,
  OrderItem,
  PortfolioItem,
  Portfolio,
  ProgressMessage
} from '@redhat-cloud-services/catalog-client';
import { Source } from '@redhat-cloud-services/sources-client';
import { getAxiosInstance } from '../shared/user-login';
import { CATALOG_API_BASE, SOURCES_API_BASE } from '../../utilities/constants';
const axiosInstance = getAxiosInstance();

export interface ObjectNotFound {
  object: 'Order item' | 'Product' | 'Portfolio' | 'Messages' | 'Platform';
  notFound: boolean;
}

export type OrderDetailPayload = [
  Order,
  OrderItem | ObjectNotFound,
  PortfolioItem | ObjectNotFound,
  Source | ObjectNotFound,
  ProgressMessage | ObjectNotFound,
  Portfolio | ObjectNotFound
];

export type OrderProvisionPayload = {
  orderItems: OrderItem[] | [];
  progressMessages: ProgressMessage[] | [];
};

export const fetchOrderDetailSequence = async (
  orderId: string
): Promise<OrderDetailPayload> => {
  let order: Order;
  try {
    order = await axiosInstance.get(`${CATALOG_API_BASE}/orders/${orderId}`);
  } catch (error) {
    order = {};
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
      `${CATALOG_API_BASE}/order_items?order_id=${order.id}`
    );
    orderItem = orderItems.data[0];
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
        (orderItem as OrderItem).portfolio_item_id
      }`
    );
  } catch (_error) {
    // nohandler
  }

  const parallerRequests = [
    axiosInstance
      .get(
        `${SOURCES_API_BASE}/sources/${
          (portfolioItem as PortfolioItem).service_offering_source_ref
        }`
      )
      .catch(() => ({ object: 'Platform', notFound: true })),

    axiosInstance
      .get(
        `${CATALOG_API_BASE}/order_items/${
          (orderItem as OrderItem).id
        }/progress_messages`
      )
      .catch(() => ({ object: 'Messages', notFound: true })),
    axiosInstance
      .get(
        `${CATALOG_API_BASE}/portfolios/${
          (portfolioItem as PortfolioItem).portfolio_id
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
    console.log('Debug - orderItems: items, orderItems', items, orderItems);
  } catch (error) {
    orderItems = [];
    if (error.status === 404 || error.status === 400) {
      catalogHistory.replace({
        pathname: '/404',
        state: { from: catalogHistory.location }
      });
    } else {
      throw error;
    }
  }

  const promises = orderItems.map((orderItem) =>
    axiosInstance.get(
      `${CATALOG_API_BASE}/order_items/${orderItem.id}/progress_messages`
    )
  );

  return Promise.all(promises).then((itemMessages) => {
    console.log('Debug - itemMessages, orderItems', itemMessages, orderItems);
    const progressMessages = itemMessages.reduce(
      (acc, curr) => ({
        ...acc,
        ...curr.data
      }),
      {}
    );
    console.log('Debug - progressMessages', progressMessages);
    return { orderItems, progressMessages };
  });
};
