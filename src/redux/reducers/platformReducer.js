import {
  FETCH_PLATFORM,
  FETCH_PLATFORMS,
  FETCH_PLATFORM_ITEMS,
  FETCH_PLATFORM_ITEM,
  FILTER_PLATFORM_ITEMS,
  FETCH_MULTIPLE_PLATFORM_ITEMS
} from '../../redux/ActionTypes';

// Initial State
export const platformInitialState = {
  isPlatformDataLoading: true,
  platforms: [],
  platformItems: {},
  platformItem: {},
  platform: {},
  filterValue: ''
};

// rename isPlatformLoading.. to isLoaing so we can use common action for loading states

const setLoadingState = state => ({ ...state, isPlatformDataLoading: true });
const setPlatforms = (state, { payload }) => ({ ...state, platforms: payload, isPlatformDataLoading: false });
const setPlatformItems = (state, { payload, meta: { platformId }}) =>
  ({ ...state, platformItems: { ...state.platformItems, [platformId]: payload }, isPlatformDataLoading: false });
const setMultiplePlatformItems = (state, { payload }) =>
  ({ ...state, platformItems: { ...state.platformItems, ...payload }, isPlatformDataLoading: false });
const setPortfolioItems = (state, { payload }) => ({ ...state, portfolioItem: payload, isPlatformDataLoading: false });
const selectPlatform = (state, { payload }) => ({ ...state, selectedPlatform: payload, isLoading: false });
const filterPlatformItems = (state, { payload }) => ({ ...state, filterValue: payload });

export default {
  [`${FETCH_PLATFORMS}_PENDING`]: setLoadingState,
  [`${FETCH_PLATFORMS}_FULFILLED`]: setPlatforms,
  [`${FETCH_PLATFORM_ITEMS}_PENDING`]: setLoadingState,
  [`${FETCH_PLATFORM_ITEMS}_FULFILLED`]: setPlatformItems,
  [`${FETCH_PLATFORM_ITEM}_PENDING`]: setLoadingState,
  [`${FETCH_PLATFORM_ITEM}_FULFILLED`]: setPortfolioItems,
  [`${FETCH_PLATFORM}_PENDING`]: setLoadingState,
  [`${FETCH_PLATFORM}_FULFILLED`]: selectPlatform,
  [`${FILTER_PLATFORM_ITEMS}_FULFILLED`]: filterPlatformItems,
  [`${FETCH_MULTIPLE_PLATFORM_ITEMS}_FULFILLED`]: setMultiplePlatformItems
};
