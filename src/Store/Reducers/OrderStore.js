import * as ActionTypes from '../../Store/ActionTypes';

// Initial State
const initialState = {
  servicePlans: [],
  selectedPlan: {},
  serviceData: {},
  isLoading: true
};

// Reducer
const OrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_SERVICE_PLANS + '_PENDING':
      return {
        ...state,
        isLoading: true
      };
    case ActionTypes.FETCH_SERVICE_PLANS + '_FULFILLED':
      return {
        ...state,
        servicePlans: action.payload,
        isLoading: false
      };
    case ActionTypes.LIST_ORDERS + '_PENDING':
      return {
        ...state,
        isLoading: true
      };
    case ActionTypes.LIST_ORDERS + '_FULFILLED':
      return {
        ...state,
        orders: action.payload,
        isLoading: false
      };
    case ActionTypes.FETCH_SERVICE_PLAN_PARAMETERS + '_PENDING':
      return {
        ...state,
        isLoading: true
      };
    case ActionTypes.FETCH_SERVICE_PLAN_PARAMETERS + '_FULFILLED':
      return {
        ...state,
        planParameters: action.payload,
        isLoading: false
      };
    case ActionTypes.SUBMIT_SERVICE_ORDER + '_FULFILLED':
      return {
        ...state,
        ...action.payload,
        isLoading: false
      };
    case ActionTypes.UPDATE_SERVICE_DATA:
      return {
        ...state,
        serviceData: action.payload,
        isLoading: false
      };
    case ActionTypes.SET_SELECTED_PLAN:
      return {
        ...state,
        selectedPlan: action.payload,
        isLoading: false
      };
    default:
      return state;
  }
};

export default OrderReducer;
