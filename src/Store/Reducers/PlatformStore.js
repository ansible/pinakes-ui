import * as ActionTypes from '../../Store/ActionTypes';

// Initial State
const initialState = {
  isPlatformDataLoading: true,
  platforms: [],
  platformItems: [],
  platformItem: {},
  filterValue: ''
};

const PlatformReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_PLATFORMS + '_PENDING':
      return {
        ...state,
        isPlatformDataLoading: true
      };
    case ActionTypes.FETCH_PLATFORMS + '_FULFILLED':
      return {
        ...state,
        platforms: action.payload,
        isPlatformDataLoading: false
      };
    case ActionTypes.FETCH_PLATFORM_ITEMS + '_PENDING':
      return {
        ...state,
        isPlatformDataLoading: true
      };
    case ActionTypes.FETCH_PLATFORM_ITEMS + '_FULFILLED':
      return {
        ...state,
        platformItems: action.payload,
        isPlatformDataLoading: false
      };
    case ActionTypes.FETCH_PLATFORM_ITEM + '_PENDING':
      return {
        ...state,
        isPlatformDataLoading: true
      };
    case ActionTypes.FETCH_PLATFORM_ITEM + '_FULFILLED':
      return {
        ...state,
        portfolioItem: action.payload,
        isPlatformDataLoading: false
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

export default PlatformReducer;
