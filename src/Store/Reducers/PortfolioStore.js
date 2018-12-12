import * as ActionTypes from '../../Store/ActionTypes';

// Initial State
const initialState = {
  portfolioItems: [],
  portfolioItem: {},
  portfolios: [],
  portfolio: {},
  filterValue: '',
  isLoading: true
};

const PortfolioReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_PORTFOLIOS + '_PENDING':
      return {
        ...state,
        isLoading: true
      };
    case ActionTypes.FETCH_PORTFOLIOS + '_FULFILLED':
      return {
        ...state,
        portfolios: action.payload,
        isLoading: false
      };

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
    case ActionTypes.FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO + '_PENDING':
      return {
        ...state,
        isLoading: true
      };
    case ActionTypes.FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO + '_FULFILLED':
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
    case ActionTypes.FETCH_PORTFOLIO + '_PENDING':
      return {
        ...state,
        isLoading: true
      };
    case ActionTypes.FETCH_PORTFOLIO + '_FULFILLED':
      return {
        ...state,
        selectedPortfolio: action.payload,
        isLoading: false
      };
    case ActionTypes.FILTER_PORTFOLIO_ITEMS + '_FULFILLED':
      return {
        ...state,
        filterValue: action.payload
      };
    default:
      return state;
  }
};

export default PortfolioReducer;
