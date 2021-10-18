import { Request } from '@redhat-cloud-services/approval-client';
import {
  ServicePlan,
  Order,
  PortfolioItem,
  Portfolio,
  OrderItem,
  ApprovalRequest
} from '@redhat-cloud-services/catalog-client';
import { Source } from '@redhat-cloud-services/sources-client';
import {
  FETCH_SERVICE_PLANS,
  LIST_ORDERS,
  FETCH_SERVICE_PLAN_PARAMETERS,
  SUBMIT_SERVICE_ORDER,
  SET_SELECTED_PLAN,
  FETCH_REQUESTS,
  FETCH_ORDER_ITEMS,
  SET_LOADING_STATE,
  SET_ORDERS,
  FETCH_ORDERS,
  SET_ORDER_DETAIL,
  FETCH_APPROVAL_REQUESTS,
  SET_ORDER_PROVISION_ITEMS
} from '../action-types';

import { defaultSettings } from '../../helpers/shared/pagination';
import {
  ApiCollectionResponse,
  AnyObject,
  ReduxActionHandler,
  Full,
  InternalPortfolioItem
} from '../../types/common-types';
import {
  ObjectNotFound,
  ProgressMessageItem
} from '../../helpers/order/new-order-helper';

export interface OrderDetail extends AnyObject {
  approvalRequest?: ApiCollectionResponse<ApprovalRequest>;
  order: Full<Order>;
  orderItem?: Full<OrderItem>;
  portfolioItem: Full<InternalPortfolioItem> & Partial<ObjectNotFound>;
  platform: Full<Source> & Partial<ObjectNotFound>;
  portfolio: Full<Portfolio> & Partial<ObjectNotFound>;
}

export interface OrderProvisionType extends AnyObject {
  orderItems: Full<OrderItem>[];
  progressMessageItems: Full<ProgressMessageItem>[];
}

export interface OrderReducerState extends AnyObject {
  servicePlans: ServicePlan[];
  selectedPlan: ServicePlan;
  isLoading: boolean;
  requests: Request[];
  orderDetail: OrderDetail;
  orders: ApiCollectionResponse<OrderDetail>;
  orderProvision: OrderProvisionType;
}
// Initial State
export const orderInitialState: OrderReducerState = {
  servicePlans: [],
  selectedPlan: {},
  isLoading: false,
  requests: [],
  orderDetail: {
    order: {} as Full<Order>,
    portfolioItem: {} as Full<PortfolioItem>,
    platform: {} as Full<Source>,
    portfolio: {} as Full<Portfolio>
  },
  orderProvision: {
    orderItems: [] as Full<OrderItem>[],
    progressMessageItems: [] as Full<ProgressMessageItem>[]
  },
  orders: {
    data: [],
    results: [],
    meta: { ...defaultSettings }
  }
};

export type OrderReducerActionHandler = ReduxActionHandler<OrderReducerState>;

const setLoadingState: OrderReducerActionHandler = (
  state,
  { payload = true }
) => ({
  ...state,
  isLoading: payload
});
const setServicePlans: OrderReducerActionHandler = (state, { payload }) => ({
  ...state,
  servicePlans: payload,
  isLoading: false
});
const setListOrder: OrderReducerActionHandler = (state, { payload }) => ({
  ...state,
  orders: payload,
  isLoading: false
});
const setPlanParameters: OrderReducerActionHandler = (state, { payload }) => ({
  ...state,
  planParameters: payload,
  isLoading: false
});
const submitServiceOrder: OrderReducerActionHandler = (state, { payload }) => ({
  ...state,
  ...payload,
  isLoading: false
});
const selectPlan: OrderReducerActionHandler = (state, { payload }) => ({
  ...state,
  selectedPlan: payload,
  isLoading: false
});
const setRequests: OrderReducerActionHandler = (state, { payload }) => ({
  ...state,
  requests: payload,
  isLoading: false
});
const setOrderItems: OrderReducerActionHandler = (state, { payload }) => ({
  ...state,
  orderItems: payload,
  isLoading: false
});
const setOrders: OrderReducerActionHandler = (state, { payload }) => ({
  ...state,
  orders: payload
});
const setOrderDetail: OrderReducerActionHandler = (state, { payload }) => ({
  ...state,
  orderDetail: payload
});
const updateOrderApprovalRequests: OrderReducerActionHandler = (
  state,
  { payload }
) => ({
  ...state,
  orderDetail: {
    ...state.orderDetail,
    approvalRequest: payload
  }
});
const setOrderProvisionItems: OrderReducerActionHandler = (
  state,
  { payload }
) => ({
  ...state,
  orderProvision: payload
});

export default {
  [`${FETCH_SERVICE_PLANS}_PENDING`]: setLoadingState,
  [`${FETCH_SERVICE_PLANS}_FULFILLED`]: setServicePlans,
  [`${LIST_ORDERS}_PENDING`]: setLoadingState,
  [`${LIST_ORDERS}_FULFILLED`]: setListOrder,
  [`${FETCH_SERVICE_PLAN_PARAMETERS}_PENDING`]: setLoadingState,
  [`${FETCH_SERVICE_PLAN_PARAMETERS}_FULFILLED`]: setPlanParameters,
  [`${SUBMIT_SERVICE_ORDER}_PENDING`]: setLoadingState,
  [`${SUBMIT_SERVICE_ORDER}_FULFILLED`]: submitServiceOrder,
  [SET_SELECTED_PLAN]: selectPlan,
  [`${FETCH_REQUESTS}_PENDING`]: setLoadingState,
  [`${FETCH_REQUESTS}_FULFILLED`]: setRequests,
  [`${FETCH_ORDER_ITEMS}_PENDING`]: setLoadingState,
  [`${FETCH_ORDER_ITEMS}_FULFILLED`]: setOrderItems,
  [SET_LOADING_STATE]: setLoadingState,
  [`${FETCH_ORDERS}_FULFILLED`]: setOrders,
  [`${FETCH_ORDERS}_PENDING`]: setLoadingState,
  [SET_ORDERS]: setOrders,
  [`${SET_ORDER_DETAIL}_FULFILLED`]: setOrderDetail,
  [SET_ORDER_DETAIL]: setOrderDetail,
  [`${FETCH_APPROVAL_REQUESTS}_FULFILLED`]: updateOrderApprovalRequests,
  [`${SET_ORDER_PROVISION_ITEMS}_FULFILLED`]: setOrderProvisionItems,
  [SET_ORDER_PROVISION_ITEMS]: setOrderProvisionItems
};
