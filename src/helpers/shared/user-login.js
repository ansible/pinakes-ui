import axios from 'axios';
import { WorkflowApi } from '@redhat-cloud-services/approval-client';
import { AdminsApi as CatalogAdminsApi } from '@redhat-cloud-services/catalog-client';
import { DefaultApi, ApiClient as TopologicalInventoryApiClient } from '@manageiq/topological_inventory';

import { TOPOLOGICAL_INVENTORY_API_BASE, CATALOG_API_BASE, APPROVAL_API_BASE, RBAC_API_BASE } from '../../utilities/constants';
import { AccessApi, PrincipalApi, GroupApi, ApiClient } from 'rbac_api_jsclient';

const axiosInstance = axios.create();

const resolveInterceptor = response => response.data || response;

axiosInstance.interceptors.response.use(resolveInterceptor);

const catalogAdmin = new CatalogAdminsApi(undefined, CATALOG_API_BASE, axiosInstance);
const workflowApi = new WorkflowApi(undefined, APPROVAL_API_BASE, axiosInstance);

const defaultClient = TopologicalInventoryApiClient.instance;
defaultClient.basePath = TOPOLOGICAL_INVENTORY_API_BASE;

let userTopologicalApi = new DefaultApi();

export function getTopologicalUserApi() {
  return userTopologicalApi;
}

export function getUserApi() {
  return catalogAdmin;
}

const defaultRbacClient = ApiClient.instance;
defaultRbacClient.basePath = RBAC_API_BASE;

let rbacAccessApi = new AccessApi();
let rbacPrincipalApi = new PrincipalApi();
let rbacGroupApi = new GroupApi();

export function getRbacAccessApi() {
  return rbacAccessApi;
}

export function getRbacPrincipalApi() {
  return rbacPrincipalApi;
}

export function getRbacGroupApi() {
  return rbacGroupApi;
}

export function getWorkflowApi() {
  return workflowApi;
}

export async function getUserAccess() {
  let application = 'rbac'; // String | The application name to obtain access for the principal
  let opts = {
    pageSize: 10, // Number | Parameter for selecting the amount of data in a page.
    page: 1 // Number | Parameter for selecting the page of data.
  };

  rbacAccessApi.getPrincipalAccess(application, opts).then((data) => {
    console.log('User Access API called successfully. Returned data: ' + data);
  }, (error) => {
    console.error(error);
  });
}
