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
import { GetOrderDetailParams } from './order-helper';
import { OrderItemStateEnum } from '@redhat-cloud-services/catalog-client';
import { ApiMetadata } from '../../types/common-types';

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
  axiosInstance.post(`${CATALOG_API_BASE}/orders/${orderId}/cancel/`);

const getOrderItems = (
  orderIds: string[]
): Promise<ApiCollectionResponse<OrderItem>> =>
  axiosInstance.get(
    `${CATALOG_API_BASE}/order_items/?page-size=${orderIds.length * 3 ||
      defaultSettings.limit}${orderIds.length ? '&' : ''}${orderIds
      .map((orderId) => `order_id=${orderId}`)
      .join('&')}`
  );

const getOrderPortfolioItems = (
  itemIds: string[]
): Promise<ApiCollectionResponse<PortfolioItem>> =>
  axiosInstance.get(
    `${CATALOG_API_BASE}/portfolio_items/?${itemIds
      .map((itemId) => `id=${itemId}`)
      .join('&')}`
  );

export const getOrdersS = (
  filter = '',
  pagination = defaultSettings
): Promise<{
  data: (Order & { orderItems: OrderItem[] })[];
}> =>
  axiosInstance.get(
    `${CATALOG_API_BASE}/orders/${filter}${
      filter?.length > 1 ? '&' : '?'
    }page_size=${pagination.limit}&page=${pagination.offset || 1}`
  );

export const getOrders = (
  filter = '',
  pagination = defaultSettings
): Promise<{
  data: (Order & { orderItems: OrderItem[] })[];
  portfolioItems: ApiCollectionResponse<PortfolioItem>;
}> =>
  axiosInstance
    .get(
      `${CATALOG_API_BASE}/orders/${filter}${
        filter?.length > 1 ? '&' : '?'
      }page_size=${pagination.limit}&page=${pagination.offset || 1}`
    ) // eslint-disable-line max-len
    .then((orders: ApiCollectionResponse<Full<Order>>) => {
      console.log('Debug - orders: ', orders);
      return getOrderItems(orders.results.map(({ id }) => id)).then(
        (orderItems) => {
          console.log('Debug - orderItems: ', orderItems);
          return getOrderPortfolioItems(
            orderItems.results.map(({ portfolio_item }) => portfolio_item)
          ).then((portfolioItems) => {
            console.log('Debug - portfolioItems: ', portfolioItems);
            return {
              portfolioItems,
              ...orders,
              data: orders.results.map((orderObj) => ({
                ...orderObj,
                orderItems: orderItems.results.filter(
                  ({ order }) => order === orderObj.id
                )
              }))
            };
          });
        }
      );
    });

export const getOrderDetail = (
  params: GetOrderDetailParams
): Promise<OrderDetailPayload> => {
  console.log('Debug - getOrderDetail - params: ', params);
  if (Object.values(params).some((value) => !value)) {
    /**
     * Try to fetch data sequentially if any of the parameters is unknown
     */
    return fetchOrderDetailSequence(params.order);
  }

  const detailPromises = [
    (axiosInstance
      .get(`${CATALOG_API_BASE}/orders/${params.order}/`)
      .catch((error) => {
        if (error.status === 404 || error.status === 400) {
          return catalogHistory.replace({
            pathname: '/404',
            state: { from: catalogHistory.location }
          });
        }

        throw error;
      }) as unknown) as Promise<Order>,
    axiosInstance
      .get(`${CATALOG_API_BASE}/order_items/${params['order-item']}/`)
      .catch((error) => {
        if (error.status === 404 || error.status === 400) {
          return {
            object: 'Order item',
            notFound: true
          };
        }

        throw error;
      }),
    axiosInstance
      .get(`${CATALOG_API_BASE}/portfolio_items/${params['portfolio-item']}/`)
      .catch((error) => {
        if (error.status === 404 || error.status === 400) {
          return {
            object: 'Product',
            notFound: true
          };
        }

        throw error;
      }),
    axiosInstance
      .get(`${CATALOG_INVENTORY_API_BASE}/sources/${params.platform}/`)
      .catch((error) => {
        if (error.status === 404 || error.status === 400) {
          return {
            object: 'Platform',
            notFound: true
          };
        }

        throw error;
      }),
    axiosInstance
      .get(`${CATALOG_API_BASE}/orders/${params.order}/progress_messages/`)
      .catch((error) => {
        if (error.status === 404 || error.status === 400) {
          return {};
        }

        throw error;
      }),
    axiosInstance
      .get(`${CATALOG_API_BASE}/portfolios/${params.portfolio}/`)
      .catch((error) => {
        if (error.status === 404 || error.status === 400) {
          return {
            object: 'Portfolio',
            notFound: true
          };
        }

        throw error;
      })
  ];

  return (Promise.all(detailPromises) as unknown) as Promise<
    OrderDetailPayload
  >;
};

const APPROVAL_REQUESTER_PERSONA = 'approval/requester';
export interface RequestTranscript extends Full<Request> {
  actions: Action[];
}
const requestTranscriptQuery = (parent_id: string) => `query {
  requests(id: "${parent_id}") {
    id
    number_of_children
    decision
    group_name
    created_at
    state
    actions {
      id
      created_at
    }
    requests {
      id
      number_of_children
      decision
      group_name
      state
      parent_id
      created_at
      actions {
        id
        created_at
      }
    }
  }
}`;
const fetchRequestTranscript = (
  requestId: string
): Promise<RequestTranscript[]> =>
  axiosInstance
    .get(`${APPROVAL_API_BASE}/requests/${requestId}/`, {
      'x-rh-persona': APPROVAL_REQUESTER_PERSONA
    })
    .then(({ data: { requests } }) => {
      return requests &&
        requests.length > 0 &&
        requests[0].number_of_children > 0
        ? requests[0].requests
        : requests;
    });

export const getApprovalRequests = (
  orderItemId: string
): Promise<{
  data: { group_name: string; decision: string; updated?: string }[];
}> =>
  axiosInstance
    .get(`${CATALOG_API_BASE}/order_items/${orderItemId}/approval_requests/`)
    .then(({ data }: { data: Full<ApprovalRequest>[] }) => {
      const promises = data.map(({ approval_request_ref }) =>
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
