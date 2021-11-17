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
  RBAC_API_BASE
} from '../../utilities/constants';
import { GroupApi } from '@redhat-cloud-services/rbac-client';
import { stringify } from 'qs';

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
  if (window.catalog?.standalone) {
    const token = window.catalog?.token;
    return axios.create({
      paramsSerializer: (params) => stringify(params),
      headers: { Authorization: `Basic ${token}` }
    });
  } else {
    return axios.create({
      paramsSerializer: (params) => stringify(params)
    });
  }
};

const axiosInstance: AxiosInstance = createAxiosInstance();

const resolveInterceptor = (response: AxiosResponse) =>
  response.data || response;
const errorInterceptor = (error: ServerError = {}) => {
  const requestId = error.response?.headers?.['x-rh-insights-request-id'];
  throw requestId ? { ...error.response, requestId } : { ...error.response };
};

const unauthorizedInterceptor = (error: ServerError = {}) => {
  if (error.status === 403) {
    throw {
      ...error,
      redirect: {
        pathname: '/403',
        message: error.config?.url
      }
    };
  }

  throw error;
};

// check identity before each request. If the token is expired it will log out user
axiosInstance.interceptors.request.use(async (config) => {
  // eslint-disable-next-line no-undef
  if (!window.catalog?.standalone) {
    await window.insights.chrome.auth.getUser();
  } else {
    if (window.catalog?.token) {
      config.headers.Authorization = `Basic ${window.catalog.token}`;
    }
  }

  return config;
});
axiosInstance.interceptors.response.use(resolveInterceptor);
axiosInstance.interceptors.response.use(undefined, errorInterceptor);
axiosInstance.interceptors.response.use(undefined, unauthorizedInterceptor);

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
  if (!window.catalog?.standalone) {
    await window.insights.chrome.auth.getUser();
  }

  return config;
});
/**
 * Graphql does not return error response when the qery fails.
 * Instead it returns 200 response with error object.
 * We catch it and throw it to trigger notification middleware
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
