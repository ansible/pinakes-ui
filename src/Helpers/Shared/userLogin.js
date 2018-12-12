let TopologicalInventory = require('topological_inventory');
let ServicePortalApi = require('service_portal_api');

// TODO - replace with actual login info when available
let admin_hash = { 'x-rh-auth-identity': btoa(JSON.stringify({ identity: { is_org_admin: true }})) };
const adminApi = new ServicePortalApi.AdminsApi();
Object.assign(adminApi.apiClient.defaultHeaders, admin_hash);

export function getUserApi() {
  return adminApi;
}
//UserSecurity.username = 'YOUR USERNAME'
//UserSecurity.password = 'YOUR PASSWORD'

let userTopologicalApi = new TopologicalInventory.DefaultApi();

export function getTopologicalUserApi() {
  return userTopologicalApi;
}
