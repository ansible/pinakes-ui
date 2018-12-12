import {
  FETCH_SERVICE_PLANS,
  LIST_ORDERS,
  FETCH_SERVICE_PLAN_PARAMETERS,
  SUBMIT_SERVICE_ORDER,
  UPDATE_SERVICE_DATA,
  SET_SELECTED_PLAN
} from '../ActionTypes';

// Initial State
export const orderInitialState = {
  servicePlans: [],
  selectedPlan: {},
  serviceData: {},
  isLoading: true
};

const setLoadingState = state => ({ ...state, isLoading: true });
const setServicePlans = (state, { payload }) => ({ ...state, servicePlans: payload, isLoading: false });
const setListOrder = (state, { payload }) => ({ ...state, orders: payload, isLoading: false });
const setPlanParameters = (state, { payload }) => ({ ...state, planParameters: payload, isLoading: false });
const submitServiceOrder = (state, { payload }) => ({ ...state, ...payload, isLoading: false });
const updateServiceDate = (state, { payload }) => ({ ...state, serviceData: payload, isLoading: false });
const selectPlan = (state, { payload }) => ({ ...state, selectedPlan: payload, isLoading: false });

export default {
  [`${FETCH_SERVICE_PLANS}_PENDING`]: setLoadingState,
  [`${FETCH_SERVICE_PLANS}_FULFILLED`]: setServicePlans,
  [`${LIST_ORDERS}_PENDING`]: setLoadingState,
  [`${LIST_ORDERS}_FULFILLED`]: setListOrder,
  [`${FETCH_SERVICE_PLAN_PARAMETERS}_PENDING`]: setLoadingState,
  [`${FETCH_SERVICE_PLAN_PARAMETERS}_FULFILLED`]: setPlanParameters,
  [`${SUBMIT_SERVICE_ORDER}_FULFILLED`]: submitServiceOrder,
  [UPDATE_SERVICE_DATA]: updateServiceDate,
  [SET_SELECTED_PLAN]: selectPlan
};
