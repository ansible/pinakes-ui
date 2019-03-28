/* eslint camelcase: 0 */
import * as CatalogApi from '@manageiq/service-portal-api';
import { CATALOG_API_BASE } from '../../utilities/constants';

let api = new CatalogApi.AdminsApi();

const sspDefaultClient = CatalogApi.ApiClient.instance;
sspDefaultClient.basePath = CATALOG_API_BASE;

export function getServicePlans(portfolioItemId) {
  return api.listServicePlans(portfolioItemId);
}

export function listOrders() {
  return api.listOrders();
}

export async function sendSubmitOrder({ service_parameters: { providerControlParameters, ...service_parameters }, ...parameters }) {
  let order = await api.createOrder();
  let orderItem = new CatalogApi.OrderItem;
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
