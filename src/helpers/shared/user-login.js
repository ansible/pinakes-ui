import axios from 'axios';
import {  RequestApi, WorkflowApi } from '@redhat-cloud-services/approval-client';
import { PortfolioApi, PortfolioItemApi, OrderApi, OrderItemApi } from '@redhat-cloud-services/catalog-client';
import { DefaultApi, ApiClient as TopologicalInventoryApiClient } from '@manageiq/topological_inventory';

import { TOPOLOGICAL_INVENTORY_API_BASE, CATALOG_API_BASE, APPROVAL_API_BASE, RBAC_API_BASE } from '../../utilities/constants';
import { AccessApi, PrincipalApi, GroupApi, ApiClient } from 'rbac_api_jsclient';

const axiosInstance = axios.create();

const resolveInterceptor = response => response.data || response;

axiosInstance.interceptors.response.use(resolveInterceptor);

const orderApi = new OrderApi(undefined, CATALOG_API_BASE, axiosInstance);
const orderItemApi = new OrderItemApi(undefined, CATALOG_API_BASE, axiosInstance);
const portfolioApi = new PortfolioApi(undefined, CATALOG_API_BASE, axiosInstance);
const portfolioItemApi = new PortfolioItemApi(undefined, CATALOG_API_BASE, axiosInstance);
const requestsApi = new RequestApi(undefined, APPROVAL_API_BASE, axiosInstance);
const workflowApi = new WorkflowApi(undefined, APPROVAL_API_BASE, axiosInstance);

window.magix = {
  orderApi,
  orderItemApi,
  portfolioApi,
  portfolioItemApi,
  requestsApi,
  workflowApi
};

const defaultClient = TopologicalInventoryApiClient.instance;
defaultClient.basePath = TOPOLOGICAL_INVENTORY_API_BASE;

let userTopologicalApi = new DefaultApi();

export function getTopologicalUserApi() {
  return userTopologicalApi;
}

export function getPortfolioApi() {
  return portfolioApi;
}

export function getPortfolioItemApi() {
  return portfolioItemApi;
}

export function getOrderApi() {
  return orderApi;
}

export function getOrderItemApi() {
  return orderItemApi;
}

export function getRequestsApi() {
  return requestsApi;
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
