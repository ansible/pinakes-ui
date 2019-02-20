/* eslint camelcase: 0 */
import * as ServicePortalApi from '@manageiq/service-portal-api';
import { SERVICE_PORTAL_API_BASE } from '../../Utilities/Constants';

let api = new ServicePortalApi.AdminsApi();

const sspDefaultClient = ServicePortalApi.ApiClient.instance;
sspDefaultClient.basePath = SERVICE_PORTAL_API_BASE;

export function getServicePlans(portfolioItemId) {
  return api.fetchPlansWithPortfolioItemId(portfolioItemId);
}

export function listOrders() {
  return api.listOrders();
}

export async function sendSubmitOrder({ service_parameters: { providerControlParameters, ...service_parameters }, ...parameters }) {
  let order = await api.newOrder();
  let orderItem = new ServicePortalApi.OrderItem;
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
