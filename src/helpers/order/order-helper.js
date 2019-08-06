/* eslint camelcase: 0 */
import { getAxiosInstance, getPortfolioItemApi, getOrderApi, getRequestsApi } from '../shared/user-login';
import { CATALOG_API_BASE } from '../../utilities/constants';

const orderApi = getOrderApi();
const portfolioItemApi = getPortfolioItemApi();
const requestsApi = getRequestsApi();
const axiosInstance = getAxiosInstance();

export function getServicePlans(portfolioItemId) {
  return portfolioItemApi.listServicePlans(portfolioItemId);
}

export function listOrders() {
  return orderApi.listOrders();
}

export async function sendSubmitOrder({ service_parameters: { providerControlParameters, ...service_parameters }, ...parameters }) {
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
  return requestsApi.listRequests().then(data => ({
    ...data,
    data: data.data.map(({ decision, ...item }) => ({
      ...item,
      state: decision
    })) }));
}

export function listOrderItems() {
  return axiosInstance.get(`${CATALOG_API_BASE}/order_items`);
}

export function cancelOrder(orderId) {
  return orderApi.cancelOrder(orderId);
}
