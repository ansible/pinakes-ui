import * as ActionTypes from 'Store/ActionTypes';
import DEFAULT_PAGE_SIZE from '../../Utilities/Constants';

// Initial State
const initialState = {
    catalogItems: [],
    catalogItem: {},
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    pages: 1,
    filterValue: '',
    isLoading: true
};

// Reducer
export const CatalogItemReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.FETCH_CATALOG_ITEMS + '_PENDING':
            return {
                ...state,
                isLoading: true
            };
        case ActionTypes.FETCH_CATALOG_ITEMS + '_FULFILLED':
            return {
                ...state,
                ...action.payload,
                isLoading: false
           };
        case ActionTypes.FETCH_CATALOG_ITEM + '_PENDING':
            return {
                ...state,
                isLoading: true
            };
        case ActionTypes.FETCH_CATALOG_ITEM + '_FULFILLED':
            return {
                ...state,
                ...action.payload,
                isLoading: false
            };
        case ActionTypes.FILTER_CATALOG_ITEMS + '_FULFILLED':
            return {
                ...state,
                filterValue: action.payload
            };
        default:
            return state;
    }
};
