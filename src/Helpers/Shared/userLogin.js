import { AdminsApi } from 'service_portal_api';
import { DefaultApi } from 'topological_inventory';

// TODO - replace with actual login info when available
let admin_hash = { 'x-rh-auth-identity': btoa(JSON.stringify({ identity: { is_org_admin: true }})) };
const adminApi = new AdminsApi();
Object.assign(adminApi.apiClient.defaultHeaders, admin_hash);

export function getUserApi() {
  return adminApi;
}
//UserSecurity.username = 'YOUR USERNAME'
//UserSecurity.password = 'YOUR PASSWORD'

let userTopologicalApi = new DefaultApi();

export function getTopologicalUserApi() {
  return userTopologicalApi;
}
