/* eslint camelcase: 0 */
import {
  getAxiosInstance,
  getPortfolioItemApi,
  getOrderApi,
  getRequestsApi,
  getOrderItemApi
} from '../shared/user-login';
import { CATALOG_API_BASE, SOURCES_API_BASE } from '../../utilities/constants';
import { defaultSettings } from '../shared/pagination';

const orderApi = getOrderApi();
const orderItemApi = getOrderItemApi();
const portfolioItemApi = getPortfolioItemApi();
const requestsApi = getRequestsApi();
const axiosInstance = getAxiosInstance();

export function getServicePlans(portfolioItemId) {
  return portfolioItemApi.listServicePlans(portfolioItemId);
}

export async function sendSubmitOrder({
  service_parameters: { providerControlParameters, ...service_parameters },
  ...parameters
}) {
  let order = await orderApi.createOrder();
  let orderItem = {};
  orderItem.count = 1;
  orderItem = {
    ...orderItem,
    ...parameters,
    service_parameters,
    provider_control_parameters: providerControlParameters || {}
  };
  await orderApi.addToOrder(order.id, orderItem);
  return orderApi.submitOrder(order.id);
}

export function listRequests() {
  return requestsApi.listRequests().then((data) => ({
    ...data,
    data: data.data.map(({ decision, ...item }) => ({
      ...item,
      state: decision
    }))
  }));
}

export function cancelOrder(orderId) {
  return orderApi.cancelOrder(orderId);
}

const getOrderItems = (orderIds) =>
  axiosInstance.get(
    `${CATALOG_API_BASE}/order_items?${orderIds
      .map((orderId) => `filter[order_id][]=${orderId}`)
      .join('&')}`
  );

const getOrderPortfolioItems = (itemIds) =>
  axiosInstance.get(
    `${CATALOG_API_BASE}/portfolio_items?${itemIds
      .map((itemId) => `filter[id][]=${itemId}`)
      .join('&')}`
  );

export const getOrders = (filter, pagination = defaultSettings) =>
  axiosInstance
    .get(
      `${CATALOG_API_BASE}/orders?${filter}&limit=${pagination.limit}&offset=${pagination.offset}`
    ) // eslint-disable-line max-len
    .then((orders) =>
      getOrderItems(orders.data.map(({ id }) => id)).then((orderItems) =>
        getOrderPortfolioItems(
          orderItems.data.map(({ portfolio_item_id }) => portfolio_item_id)
        ).then((portfolioItems) => {
          return {
            portfolioItems,
            ...orders,
            data: orders.data.map((order) => ({
              ...order,
              orderItems: orderItems.data.filter(
                ({ order_id }) => order_id === order.id
              )
            }))
          };
        })
      )
    );

export function getOrderApprovalRequests(orderItemId) {
  return orderItemApi.listApprovalRequests(orderItemId);
}

export const getOrderDetail = (params) => {
  return Promise.all([
    axiosInstance.get(`${CATALOG_API_BASE}/orders/${params.order}`),
    axiosInstance.get(
      `${CATALOG_API_BASE}/order_items/${params['order-item']}`
    ),
    axiosInstance.get(
      `${CATALOG_API_BASE}/portfolio_items/${params['portfolio-item']}`
    ),
    axiosInstance.get(`${SOURCES_API_BASE}/sources/${params.platform}`),
    axiosInstance.get(
      `${CATALOG_API_BASE}/order_items/${params['order-item']}/progress_messages`
    ),
    axiosInstance.get(`${CATALOG_API_BASE}/portfolios/${params.portfolio}`),
    axiosInstance.get(
      `${CATALOG_API_BASE}/order_items/${params['order-item']}/approval_requests`
    )
  ]);
};
