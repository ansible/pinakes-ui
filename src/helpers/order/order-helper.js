/* eslint camelcase: 0 */
import { getPortfolioItemApi, getOrderApi } from '../shared/user-login';

let api = getOrderApi();
const portfolioItemApi = getPortfolioItemApi();

export function getServicePlans(portfolioItemId) {
  return portfolioItemApi.listServicePlans(portfolioItemId);
}

export function listOrders() {
  return api.listOrders();
}

export async function sendSubmitOrder({ service_parameters: { providerControlParameters, ...service_parameters }, ...parameters }) {
  let order = await api.createOrder();
  let orderItem = {};
  orderItem.count = 1;
  orderItem = {
    ...orderItem,
    ...parameters,
    service_parameters,
    provider_control_parameters: providerControlParameters
  };
  await api.addToOrder(order.id, orderItem);
  return api.submitOrder(order.id);
}
