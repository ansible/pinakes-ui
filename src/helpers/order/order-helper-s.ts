/* eslint camelcase: 0 */
import { getAxiosInstance } from '../shared/user-login';
import {
  CATALOG_API_BASE,
  APPROVAL_API_BASE,
  CATALOG_INVENTORY_API_BASE
} from '../../utilities/constants';
import { defaultSettings } from '../shared/pagination';
import catalogHistory from '../../routing/catalog-history';
import {
  fetchOrderDetailSequence,
  fetchOrderProvisionItems,
  OrderDetailPayload,
  OrderProvisionPayload
} from './new-order-helper-s';
import {
  ApiCollectionResponse,
  EnhancedOrder,
  Full
} from '../../types/common-types-s';
import {
  ServicePlan,
  Order,
  PortfolioItem,
  ApprovalRequest,
  ProgressMessage
} from '@redhat-cloud-services/catalog-client';
import { AxiosPromise } from 'axios';
import { AnyObject } from '@data-driven-forms/react-form-renderer';
import { Request, Action } from '@redhat-cloud-services/approval-client';
import { OrderItemStateEnum } from '@redhat-cloud-services/catalog-client';
import { GetOrderDetailParams } from './order-helper';

const axiosInstance = getAxiosInstance();

export interface OrderItem {
  id?: string;
  name?: string;
  count: number;
  service_parameters?: any | null;
  provider_control_parameters?: any | null;
  portfolio_item: string;
  state?: OrderItemStateEnum;
  order?: string;
  created_at?: string;
  order_request_sent_at?: string;
  completed_at?: string;
  updated_at?: string;
  owner?: string;
  external_url?: string;
  insights_request_id?: string;
  process_sequence?: number;
  process_scope?: string;
  artifacts?: any;
}

export const sendSubmitOrder = async (
  {
    service_parameters: { providerControlParameters, ...service_parameters },
    ...parameters
  }: AnyObject,
  portfolioItem: AnyObject
): Promise<EnhancedOrder> => {
  const order: Order = await axiosInstance.post(`${CATALOG_API_BASE}/orders/`);
  let orderItem: Partial<OrderItem> = {};
  orderItem.count = 1;
  orderItem = {
    ...orderItem,
    ...parameters,
    service_parameters,
    provider_control_parameters: providerControlParameters || {}
  };
  const orderItemResponse = await axiosInstance.post(
    `${CATALOG_API_BASE}/orders/${order.id}/order_items/`,
    {
      id: order.id,
      name: `orderItem_${order.id}`,
      portfolio_item: portfolioItem.id,
      ...orderItem
    }
  );
  return axiosInstance
    .post(`${CATALOG_API_BASE}/orders/${order.id}/submit/`)
    .then((order) => ({
      ...order,
      orderItem: (orderItemResponse as unknown) as OrderItem
    }));
};

export const cancelOrder = (orderId: string): AxiosPromise<Order> =>
  axiosInstance.patch(`${CATALOG_API_BASE}/orders/${orderId}/cancel/`);

export const getOrders = (
  filter = '',
  pagination = defaultSettings
): Promise<{
  data: Order[];
}> => {
  return axiosInstance.get(
    `${CATALOG_API_BASE}/orders/?extra=true${
      filter?.length > 1 ? '&' : ''
    }${filter}&page_size=${pagination.limit}&page=${pagination.offset || 1}`
  );
};

export const getOrderDetail = (
  params: GetOrderDetailParams
): Promise<OrderDetailPayload> => {
  return fetchOrderDetailSequence(params.order);
};

export interface RequestTranscript extends Full<Request> {
  actions: Action[];
}

const fetchRequestTranscript = (
  requestId: string
): Promise<RequestTranscript[]> => {
  return axiosInstance
    .get(`${APPROVAL_API_BASE}/requests/${requestId}/?extra=true`)
    .then((request) => {
      return request && request.extra_data > 0 && request.number_of_children > 0
        ? request.extra_data.subrequests
        : [request];
    });
};

export const getApprovalRequests = (
  orderId: string
): Promise<{
  data: { group_name: string; decision: string; updated?: string }[];
}> =>
  axiosInstance
    .get(`${CATALOG_API_BASE}/orders/${orderId}/approval_requests/`)
    .then(({ results }: { results: Full<ApprovalRequest>[] }) => {
      const promises = results.map(({ approval_request_ref }) =>
        fetchRequestTranscript(approval_request_ref)
      );
      return Promise.all(promises).then((requests) => {
        const data = requests?.[0]?.map(({ actions, ...request }) => ({
          ...request,
          updated:
            actions?.length > 0 ? actions.pop()?.created_at : request.created_at
        }));
        return { data: data || [] };
      });
    });

export const getOrderProvisionItems = async (
  orderId: string
): Promise<OrderProvisionPayload> => {
  const items = await fetchOrderProvisionItems(orderId);
  return items;
};

export const getProgressMessages = (
  orderItemId: string
): Promise<{
  data: ProgressMessage[];
}> =>
  axiosInstance
    .get(`${CATALOG_API_BASE}/order_items/${orderItemId}/progress_messages/`)
    .then(({ data }: { data: Full<ProgressMessage>[] }) => {
      return { data: data || [] };
    });
