import * as ActionTypes from 'Store/ActionTypes';

// Initial State
const initialState = {
  portfolioItems: [],
  portfolioItem: {},
  portfolios: [],
  portfolio: {},
  platformItems: [],
  platformItem: {},
  filterValue: '',
  isLoading: true
};

// Reducer
export const PortfolioReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_PORTFOLIO_ITEMS + '_PENDING':
      return {
          ...state,
          isLoading: true
      };
    case ActionTypes.FETCH_PORTFOLIO_ITEMS + '_FULFILLED':
      return {
          ...state,
          portfolioItems: action.payload,
          isLoading: false
      };
    case ActionTypes.FETCH_PORTFOLIO_ITEM + '_PENDING':
      return {
          ...state,
          isLoading: true
      };
    case ActionTypes.FETCH_PORTFOLIO_ITEM + '_FULFILLED':
      return {
          ...state,
          portfolioItem: action.payload,
          isLoading: false
      };
    case ActionTypes.FILTER_PORTFOLIO_ITEMS + '_FULFILLED':
      return {
          ...state,
          filterValue: action.payload
      };
    case ActionTypes.FETCH_PLATFORM_ITEMS + '_PENDING':
      return {
        ...state,
        isLoading: true
      };
    case ActionTypes.FETCH_PLATFORM_ITEMS + '_FULFILLED':
      return {
        ...state,
        platformItems: action.payload,
        isLoading: false
      };
    case ActionTypes.FETCH_PLATFORM_ITEM + '_PENDING':
      return {
        ...state,
        isLoading: true
      };
    case ActionTypes.FETCH_PLATFORM_ITEM + '_FULFILLED':
      return {
        ...state,
        portfolioItem: action.payload,
        isLoading: false
      };
    case ActionTypes.FILTER_PLATFORM_ITEMS + '_FULFILLED':
      return {
        ...state,
        filterValue: action.payload
      };

      default:
          return state;
  }
};
