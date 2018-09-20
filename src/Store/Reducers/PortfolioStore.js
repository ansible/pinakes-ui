import * as ActionTypes from 'Store/ActionTypes';

// Initial State
const initialState = {
    portfolioItems: [],
    portfolioItem: {},
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
                ...action.payload,
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
        default:
            return state;
    }
};
