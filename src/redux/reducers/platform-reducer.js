import {
  FETCH_PLATFORM,
  FETCH_PLATFORMS,
  FETCH_PLATFORM_ITEMS,
  FETCH_PLATFORM_ITEM,
  FILTER_PLATFORM_ITEMS,
  FETCH_MULTIPLE_PLATFORM_ITEMS,
  SET_LOADING_STATE,
  FETCH_PLATFORM_INVENTORIES,
  SET_INVENTORIES_LOADING_STATE
} from '../action-types';

// Initial State
export const platformInitialState = {
  isPlatformDataLoading: false,
  selectedPlatform: {},
  platforms: [],
  platformItems: {},
  platformInventories: [],
  platformItem: {},
  platform: {},
  filterValue: ''
};

// rename isPlatformLoading.. to isLoading so we can use common action for loading states

const setLoadingState = (state, { payload = true }) => ({
  ...state,
  isPlatformDataLoading: payload
});
const setPlatforms = (state, { payload }) => ({
  ...state,
  platforms: payload,
  isPlatformDataLoading: false
});
const setPlatformItems = (state, { payload, meta: { platformId } }) => ({
  ...state,
  platformItems: { ...state.platformItems, [platformId]: payload },
  isPlatformDataLoading: false
});
const setMultiplePlatformItems = (state, { payload }) => ({
  ...state,
  platformItems: { ...state.platformItems, ...payload },
  isPlatformDataLoading: false
});
const setPortfolioItems = (state, { payload }) => ({
  ...state,
  portfolioItem: payload,
  isPlatformDataLoading: false
});
const selectPlatform = (state, { payload }) => ({
  ...state,
  selectedPlatform: payload,
  isLoading: false
});
const filterPlatformItems = (state, { payload }) => ({
  ...state,
  filterValue: payload
});
const setInventoriesDataLoadingState = (state, { payload = true }) => ({
  ...state,
  isInventoriesDataLoading: payload
});
const setPlatformInventories = (state, { payload }) => ({
  ...state,
  platformInventories: { ...state.platformInventories, ...payload },
  isInventoriesDataLoading: false
});

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
  [`${FETCH_MULTIPLE_PLATFORM_ITEMS}_FULFILLED`]: setMultiplePlatformItems,
  [SET_LOADING_STATE]: setLoadingState,
  [`${FETCH_PLATFORM_INVENTORIES}_PENDING`]: setInventoriesDataLoadingState,
  [`${FETCH_PLATFORM_INVENTORIES}_FULFILLED`]: setPlatformInventories,
  [SET_INVENTORIES_LOADING_STATE]: setInventoriesDataLoadingState
};
