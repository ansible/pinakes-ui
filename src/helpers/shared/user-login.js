import { AdminsApi, ApiClient as CatalogApiClient } from '@manageiq/service-portal-api';
import { DefaultApi, ApiClient as TopologicalInventoryApiClient } from '@manageiq/topological_inventory';
import { TOPOLOGICAL_INVENTORY_API_BASE, CATALOG_API_BASE } from '../../utilities/constants';

const adminApi = new AdminsApi();

const defaultClient = TopologicalInventoryApiClient.instance;
defaultClient.basePath = TOPOLOGICAL_INVENTORY_API_BASE;

const sspDefaultClient = CatalogApiClient.instance;
sspDefaultClient.basePath = CATALOG_API_BASE;

let userTopologicalApi = new DefaultApi();

export function getTopologicalUserApi() {
  return userTopologicalApi;
}

export function getUserApi() {
  return adminApi;
}
