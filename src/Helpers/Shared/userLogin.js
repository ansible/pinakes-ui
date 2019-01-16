import { AdminsApi, ApiClient as ServicePortalApiClient } from '@manageiq/service-portal-api';
import { DefaultApi, ApiClient as TopologicalInventoryApiClient } from '@manageiq/topological_inventory';
import { SOURCES_API_BASE, SERVICE_PORTAL_API_BASE } from '../../Utilities/Constants';

const adminApi = new AdminsApi();

const defaultClient = TopologicalInventoryApiClient.instance;
defaultClient.basePath = SOURCES_API_BASE;

const sspDefaultClient = ServicePortalApiClient.instance;
sspDefaultClient.basePath = SERVICE_PORTAL_API_BASE;

let userTopologicalApi = new DefaultApi();

export function getTopologicalUserApi() {
  return userTopologicalApi;
}

export function getUserApi() {
  return adminApi;
}
