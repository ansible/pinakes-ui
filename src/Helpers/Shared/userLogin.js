import React from 'react';

const InsightsServiceCatalogApi = require('../../../insights_hsdm_api');
const defaultClient = InsightsServiceCatalogApi.ApiClient.instance;


// Configure HTTP basic authorization: UserSecurity
const AdminSecurity = defaultClient.authentications['AdminSecurity'];

// TODO - replace with actual login info when available
let admin_hash = {'x-rh-auth-identity': btoa(JSON.stringify({'identity': {'is_org_admin': true }}))};
const adminApi = new InsightsServiceCatalogApi.AdminsApi();
Object.assign(adminApi.apiClient.defaultHeaders, admin_hash);

export function getUserApi(){
  return adminApi;
}



