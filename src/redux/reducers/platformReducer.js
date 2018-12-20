import {
  FETCH_PLATFORMS,
  FETCH_PLATFORM_ITEMS,
  FETCH_PLATFORM_ITEM,
  FILTER_PLATFORM_ITEMS
} from '../../redux/ActionTypes';

// Initial State
export const platformInitialState = {
  isPlatformDataLoading: true,
  platforms: [],
  platformItems: [],
  platformItem: {},
  filterValue: ''
};

// rename isPlatformLoading.. to isLoaing so we can use common action for loading states

const setLoadingState = state => ({ ...state, isPlatformDataLoading: true });
const setPlatforms = (state, { payload }) => ({ ...state, platforms: payload, isPlatformDataLoading: false });
const setPlatformItems = (state, { payload }) => ({ ...state, platformItems: payload, isPlatformDataLoading: false });
const setPortfolioItems = (state, { payload }) => ({ ...state, portfolioItem: payload, isPlatformDataLoading: false });
const filterPlatformItems = (state, { payload }) => ({ ...state, filterValue: payload });

export default {
  [`${FETCH_PLATFORMS}_PENDING`]: setLoadingState,
  [`${FETCH_PLATFORMS}_FULFILLED`]: setPlatforms,
  [`${FETCH_PLATFORM_ITEMS}_PENDING`]: setLoadingState,
  [`${FETCH_PLATFORM_ITEMS}_FULFILLED`]: setPlatformItems,
  [`${FETCH_PLATFORM_ITEM}_PENDING`]: setLoadingState,
  [`${FETCH_PLATFORM_ITEM}_FULFILLED`]: setPortfolioItems,
  [`${FILTER_PLATFORM_ITEMS}_FULFILLED`]: filterPlatformItems
};
