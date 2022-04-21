import axios, { AxiosResponse, AxiosRequestConfig, AxiosInstance } from 'axios';
import {
  RequestApi,
  WorkflowApi
} from '@redhat-cloud-services/approval-client';
import {
  PortfolioApi,
  PortfolioItemApi,
  OrderApi,
  OrderItemApi,
  IconApi,
  ServicePlansApi,
  OrderProcessApi
} from '@redhat-cloud-services/catalog-client';

import {
  CATALOG_API_BASE,
  APPROVAL_API_BASE,
  RBAC_API_BASE,
  AUTH_API_BASE
} from '../../utilities/constants';
import { GroupApi } from '@redhat-cloud-services/rbac-client';
import { stringify } from 'qs';
import { loginUser } from './active-user';
// @ts-ignore
import Cookies from 'js-cookie';

export interface ApiHeaders extends Headers {
  'x-rh-insights-request-id': string;
}

export interface ErrorResponse {
  headers?: ApiHeaders;
}

export interface ServerError {
  response?: ErrorResponse;
  status?: 403 | 404 | 401 | 400 | 429 | 500 | 200; // not a complete list, replace by library with complete interface
  config?: AxiosRequestConfig;
}

const createAxiosInstance = () => {
  if (localStorage.getItem('catalog_standalone')) {
    const token = localStorage.getItem('catalog-token');
    return axios.create({
      paramsSerializer: (params) => stringify(params),
      headers: { 'X-CSRFToken': Cookies.get('csrftoken') }
    });
  } else {
    return axios.create({
      paramsSerializer: (params) => stringify(params)
    });
  }
};

const axiosInstance: AxiosInstance = createAxiosInstance();

const resolveInterceptor = (response: any) => {
  const data = response?.data || response?.results;
  if (data?.data || data?.results) {
    return { ...data, data: data?.data || data?.results };
  } else {
    return data;
  }
};

export const unauthorizedInterceptor = (error: any) => {
  if (
    error.response?.status === 401 ||
    (error.response?.status === 403 &&
      error.response?.config?.url === `${AUTH_API_BASE}/me/`)
  ) {
    loginUser();
    return;
  }

  if (
    error.response?.status === 403 &&
    error.response?.config?.url !== `${AUTH_API_BASE}/me/`
  ) {
    window.location.replace('/ui/catalog/403');
    return;
  }

  throw error;
};

// check identity before each request. If the token is expired it will log out user
axiosInstance.interceptors.request.use(async (config) => {
  const csrftoken = Cookies.get('csrftoken');
  if (csrftoken) {
    config.headers['X-CSRFToken'] = csrftoken;
  }

  return config;
});

export const initUnauthorizedInterceptor = function() {
  return axiosInstance.interceptors.response.use(
    undefined,
    unauthorizedInterceptor
  );
};

initUnauthorizedInterceptor();
axiosInstance.interceptors.response.use(resolveInterceptor);

const orderApi = new OrderApi(undefined, CATALOG_API_BASE, axiosInstance);
const orderItemApi = new OrderItemApi(
  undefined,
  CATALOG_API_BASE,
  axiosInstance
);
const portfolioApi = new PortfolioApi(
  undefined,
  CATALOG_API_BASE,
  axiosInstance
);
const portfolioItemApi = new PortfolioItemApi(
  undefined,
  CATALOG_API_BASE,
  axiosInstance
);
const requestsApi = new RequestApi(undefined, APPROVAL_API_BASE, axiosInstance);
const workflowApi = new WorkflowApi(
  undefined,
  APPROVAL_API_BASE,
  axiosInstance
);
const iconApi = new IconApi(undefined, CATALOG_API_BASE, axiosInstance);
const servicePlansApi = new ServicePlansApi(
  undefined,
  CATALOG_API_BASE,
  axiosInstance
);
const orderProcessApi = new OrderProcessApi(
  undefined,
  CATALOG_API_BASE,
  axiosInstance
);

export function getPortfolioApi(): PortfolioApi {
  return portfolioApi;
}

export function getPortfolioItemApi(): PortfolioItemApi {
  return portfolioItemApi;
}

export function getOrderApi(): OrderApi {
  return orderApi;
}

export function getOrderItemApi(): OrderItemApi {
  return orderItemApi;
}

export function getRequestsApi(): RequestApi {
  return requestsApi;
}

const rbacGroupApi = new GroupApi(undefined, RBAC_API_BASE, axiosInstance);

export function getRbacGroupApi(): GroupApi {
  return rbacGroupApi;
}

export function getWorkflowApi(): WorkflowApi {
  return workflowApi;
}

export function getAxiosInstance(): AxiosInstance {
  return axiosInstance;
}

export function getIconApi(): IconApi {
  return iconApi;
}

export function getServicePlansApi(): ServicePlansApi {
  return servicePlansApi;
}

export function getOrderProcessApi(): OrderProcessApi {
  return orderProcessApi;
}

const grapqlInstance = axios.create();

grapqlInstance.interceptors.request.use(async (config) => {
  if (!localStorage.getItem('catalog_standalone')) {
    await window.insights.chrome.auth.getUser();
  }

  return config;
});
/**
 * Graphql does not return error response when the query fails.
 * Instead it returns 200 response with error object.
 * We catch it and throw it to trigger the notification middleware
 */
grapqlInstance.interceptors.response.use(({ data }) => {
  if (data.errors) {
    throw {
      message: data.errors[0].errorType,
      data: data.errors[0].message
    };
  }

  return data;
});

export function getGraphqlInstance(): AxiosInstance {
  return grapqlInstance;
}
