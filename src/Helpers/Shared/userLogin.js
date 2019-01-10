import { AdminsApi, ApiClient as ServicePortalApiClient } from '@manageiq/service-portal-api';
import { DefaultApi, ApiClient as TopologicalInventoryApiClient } from '@manageiq/topological_inventory';
import { SOURCES_API_BASE, SERVICE_PORTAL_API_BASE } from '../../Utilities/Constants';
// TODO - replace with actual login info when available
let admin_hash = { 'x-rh-auth-identity': btoa(JSON.stringify({ identity: { is_org_admin: true }})) };
const adminApi = new AdminsApi();
Object.assign(adminApi.apiClient.defaultHeaders, admin_hash);

export function getUserApi() {
  return adminApi;
}
//UserSecurity.username = 'YOUR USERNAME'
//UserSecurity.password = 'YOUR PASSWORD'

const defaultClient = TopologicalInventoryApiClient.instance;
defaultClient.basePath = SOURCES_API_BASE;

const sspDefaultClient = ServicePortalApiClient.instance;
sspDefaultClient.basePath = SERVICE_PORTAL_API_BASE;

let userTopologicalApi = new DefaultApi();

export function getTopologicalUserApi() {
  return userTopologicalApi;
}
