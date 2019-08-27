import {
  FETCH_SERVICE_PLANS,
  LIST_ORDERS,
  FETCH_SERVICE_PLAN_PARAMETERS,
  SUBMIT_SERVICE_ORDER,
  UPDATE_SERVICE_DATA,
  SET_SELECTED_PLAN,
  FETCH_REQUESTS,
  FETCH_ORDER_ITEMS,
  FETCH_LINKED_ORDERS,
  SET_LOADING_STATE,
  SET_ORDERS
} from '../action-types';

// Initial State
export const orderInitialState = {
  servicePlans: [],
  selectedPlan: {},
  serviceData: {},
  isLoading: false,
  requests: [],
  linkedOrders: { current: [], past: []}
};

const setLoadingState = (state, { payload = true }) => ({ ...state, isLoading: payload });
const setServicePlans = (state, { payload }) => ({ ...state, servicePlans: payload, isLoading: false });
const setListOrder = (state, { payload }) => ({ ...state, orders: payload, isLoading: false });
const setPlanParameters = (state, { payload }) => ({ ...state, planParameters: payload, isLoading: false });
const submitServiceOrder = (state, { payload }) => ({ ...state, ...payload, isLoading: false });
const updateServiceData = (state, { payload }) => ({ ...state, serviceData: payload, isLoading: false });
const selectPlan = (state, { payload }) => ({ ...state, selectedPlan: payload, isLoading: false });
const setRequests = (state, { payload }) => ({ ...state, requests: payload, isLoading: false });
const setOrderItems = (state, { payload }) => ({ ...state, orderItems: payload, isLoading: false });
const setLinkedOrders = (state, { payload }) => ({ ...state, linkedOrders: payload, isLoading: false });

export default {
  [`${FETCH_SERVICE_PLANS}_PENDING`]: setLoadingState,
  [`${FETCH_SERVICE_PLANS}_FULFILLED`]: setServicePlans,
  [`${LIST_ORDERS}_PENDING`]: setLoadingState,
  [`${LIST_ORDERS}_FULFILLED`]: setListOrder,
  [`${FETCH_SERVICE_PLAN_PARAMETERS}_PENDING`]: setLoadingState,
  [`${FETCH_SERVICE_PLAN_PARAMETERS}_FULFILLED`]: setPlanParameters,
  [`${SUBMIT_SERVICE_ORDER}_PENDING`]: setLoadingState,
  [`${SUBMIT_SERVICE_ORDER}_FULFILLED`]: submitServiceOrder,
  [UPDATE_SERVICE_DATA]: updateServiceData,
  [SET_SELECTED_PLAN]: selectPlan,
  [`${FETCH_REQUESTS}_PENDING`]: setLoadingState,
  [`${FETCH_REQUESTS}_FULFILLED`]: setRequests,
  [`${FETCH_ORDER_ITEMS}_PENDING`]: setLoadingState,
  [`${FETCH_ORDER_ITEMS}_FULFILLED`]: setOrderItems,
  [`${FETCH_LINKED_ORDERS}_PENDING`]: setLoadingState,
  [`${FETCH_LINKED_ORDERS}_FULFILLED`]: setLinkedOrders,
  [SET_LOADING_STATE]: setLoadingState,
  [SET_ORDERS]: setLinkedOrders
};
