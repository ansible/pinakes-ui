import axios from 'axios';
import { WorkflowApi } from '@redhat-cloud-services/approval-client';
import { AdminsApi as CatalogAdminsApi } from '@redhat-cloud-services/catalog-client';
import { DefaultApi, ApiClient as TopologicalInventoryApiClient } from '@manageiq/topological_inventory';

import { TOPOLOGICAL_INVENTORY_API_BASE, CATALOG_API_BASE, APPROVAL_API_BASE } from '../../utilities/constants';

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

export function getWorkflowApi() {
  return workflowApi;
}
