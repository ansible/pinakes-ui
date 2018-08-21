import * as ActionTypes from 'Store/ActionTypes';

// Initial State
const initialState = {
  providerDataFormat: {},
    isLoading: true
};

// Reducer
export const ProviderReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.FETCH_PROVIDER_DATA + '_PENDING':
            return {
                ...state,
                isLoading: true
            };
        case ActionTypes.FETCH_PROVIDER_DATA + '_FULFILLED':
            return {
                ...state,
                ...action.payload,
                isLoading: false
           };
      case ActionTypes.ADD_PROVIDER + '_PENDING':
        return {
          ...state,
          isLoading: true
        };
      case ActionTypes.ADD_PROVIDER + '_FULFILLED':
        return {
          ...state,
          ...action.payload,
          isLoading: false
        };
        default:
            return state;
    }
};
