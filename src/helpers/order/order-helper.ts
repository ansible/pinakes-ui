/* eslint camelcase: 0 */
import {
  getAxiosInstance,
  getPortfolioItemApi,
  getOrderApi,
  getOrderItemApi,
  getGraphqlInstance
} from '../shared/user-login';
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
} from './new-order-helper';
import {
  ApiCollectionResponse,
  ApiMetadata,
  EnhancedOrder,
  Full
} from '../../types/common-types';
import {
  ServicePlan,
  Order,
  OrderItem,
  PortfolioItem,
  ApprovalRequest,
  ProgressMessage
} from '@redhat-cloud-services/catalog-client';
import { AxiosPromise } from 'axios';
import { AnyObject } from '@data-driven-forms/react-form-renderer';
import { Request, Action } from '@redhat-cloud-services/approval-client';

const orderApi = getOrderApi();
const orderItemApi = getOrderItemApi();
const portfolioItemApi = getPortfolioItemApi();
const axiosInstance = getAxiosInstance();
const graphqlInstance = getGraphqlInstance();

export const getServicePlans = (
  portfolioItemId: string
): Promise<ApiCollectionResponse<ServicePlan>> =>
  (portfolioItemApi.listServicePlans(portfolioItemId) as unknown) as Promise<
    ApiCollectionResponse<ServicePlan>
  >;

export const sendSubmitOrder = async ({
  service_parameters: { providerControlParameters, ...service_parameters },
  ...parameters
}: AnyObject): Promise<EnhancedOrder> => {
  const order: Order = ((await orderApi.createOrder()) as unknown) as Order;
  let orderItem: Partial<OrderItem> = {};
  orderItem.count = 1;
  orderItem = {
    ...orderItem,
    ...parameters,
    service_parameters,
    provider_control_parameters: providerControlParameters || {}
  };
  const orderItemResponse = await orderApi.addToOrder(
    order.id as string,
    orderItem as OrderItem
  );
  return orderApi.submitOrder(order.id as string).then((order) => ({
    ...order,
    orderItem: (orderItemResponse as unknown) as OrderItem
  }));
};

export const cancelOrder = (orderId: string): AxiosPromise<Order> =>
  orderApi.cancelOrder(orderId);

const getOrderItems = (
  orderIds: string[]
): Promise<ApiCollectionResponse<OrderItem>> =>
  axiosInstance.get(
    `${CATALOG_API_BASE}/order_items?limit=${orderIds.length * 3 ||
      defaultSettings.limit}${orderIds.length ? '&' : ''}${orderIds
      .map((orderId) => `filter[order_id][]=${orderId}`)
      .join('&')}`
  );

const getOrderPortfolioItems = (
  itemIds: string[]
): Promise<ApiCollectionResponse<PortfolioItem>> =>
  axiosInstance.get(
    `${CATALOG_API_BASE}/portfolio_items?${itemIds
      .map((itemId) => `filter[id][]=${itemId}`)
      .join('&')}`
  );

export const getOrders = (
  filter = '',
  pagination = defaultSettings
): Promise<{
  data: (Order & { orderItems: OrderItem[] })[];
  portfolioItems: ApiCollectionResponse<PortfolioItem>;
  meta: ApiMetadata;
}> =>
  axiosInstance
    .get(
      `${CATALOG_API_BASE}/orders?${filter}&limit=${pagination.limit}&offset=${pagination.offset}`
    ) // eslint-disable-line max-len
    .then((orders: ApiCollectionResponse<Full<Order>>) =>
      getOrderItems(orders.data.map(({ id }) => id)).then((orderItems) =>
        getOrderPortfolioItems(
          orderItems.data.map(({ portfolio_item_id }) => portfolio_item_id)
        ).then((portfolioItems) => {
          return {
            portfolioItems,
            ...orders,
            data: orders.data.map((order) => ({
              ...order,
              orderItems: orderItems.data.filter(
                ({ order_id }) => order_id === order.id
              )
            }))
          };
        })
      )
    );

export const getOrderApprovalRequests = (
  orderItemId: string
): Promise<ApiCollectionResponse<Request>> =>
  (orderItemApi.listApprovalRequests(orderItemId) as unknown) as Promise<
    ApiCollectionResponse<Request>
  >;

export interface GetOrderDetailParams {
  order: string;
  'order-item'?: string;
  'portfolio-item'?: string;
  platform?: string;
  portfolio?: string;
}
export const getOrderDetail = (
  params: GetOrderDetailParams
): Promise<OrderDetailPayload> => {
  if (Object.values(params).some((value) => !value)) {
    /**
     * Try to fetch data sequentially if any of the parameters is unknown
     */
    return fetchOrderDetailSequence(params.order);
  }

  const detailPromises = [
    (axiosInstance
      .get(`${CATALOG_API_BASE}/orders/${params.order}`)
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
      .get(`${CATALOG_API_BASE}/order_items/${params['order-item']}`)
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
      .get(`${CATALOG_API_BASE}/portfolio_items/${params['portfolio-item']}`)
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
      .get(`${CATALOG_INVENTORY_API_BASE}/sources/${params.platform}`)
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
      .get(`${CATALOG_API_BASE}/orders/${params.order}/progress_messages`)
      .catch((error) => {
        if (error.status === 404 || error.status === 400) {
          return {};
        }

        throw error;
      }),
    axiosInstance
      .get(`${CATALOG_API_BASE}/portfolios/${params.portfolio}`)
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
  graphqlInstance
    .post(
      `${APPROVAL_API_BASE}/graphql`,
      { query: requestTranscriptQuery(requestId) },
      { 'x-rh-persona': APPROVAL_REQUESTER_PERSONA }
    )
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
    .get(`${CATALOG_API_BASE}/order_items/${orderItemId}/approval_requests`)
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
    .get(`${CATALOG_API_BASE}/order_items/${orderItemId}/progress_messages`)
    .then(({ data }: { data: Full<ProgressMessage>[] }) => {
      return { data: data || [] };
    });
