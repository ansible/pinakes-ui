import * as ActionTypes from 'Store/ActionTypes';
import * as OrderHelper from '../../Helpers/Order/OrderHelper';

// Initial State
const initialState = {
  servicePlans:{},
  selectedPlan:{},
  planParameters:{},
  serviceData: {},
  isLoading: true
};

// Reducer
export const OrderReducer = (state = initialState, action) => {
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
    case ActionTypes.UPDATE_SERVICE_DATA:
      return {
        ...state,
        serviceData: action.payload,
        isLoading: false
      };

    default:
      return state;
  }
};
