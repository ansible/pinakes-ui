import {
  FETCH_PLATFORM,
  FETCH_PLATFORMS,
  FETCH_PLATFORM_ITEMS,
  FETCH_PLATFORM_ITEM,
  FILTER_PLATFORM_ITEMS,
  FETCH_MULTIPLE_PLATFORM_ITEMS,
  SET_LOADING_STATE,
  FETCH_PLATFORM_INVENTORIES,
  SET_INVENTORIES_LOADING_STATE,
  FETCH_SERVICE_OFFERING,
  SET_SOURCETYPE_ICONS
} from '../action-types';
import { defaultSettings } from '../../helpers/shared/pagination';
import {
  StringObject,
  ApiCollectionResponse,
  AnyObject,
  ReduxActionHandler
} from '../../types/common-types';
import {
  Source,
  ServiceOffering,
  ServiceInventory
} from '@redhat-cloud-services/sources-client';

export interface ServiceOfferingDetail {
  service: ServiceOffering;
  source: Source;
}
export interface PlatformItemsObject {
  [key: string]: ApiCollectionResponse<ServiceOffering>;
}
export interface PlatformReducerState extends AnyObject {
  platformIconMapping: StringObject;
  sourceTypeIcons: StringObject;
  isPlatformDataLoading: boolean;
  selectedPlatform: Source;
  platforms: Source[];
  platformItems: PlatformItemsObject;
  platformInventories: ApiCollectionResponse<ServiceInventory>;
  platformItem: ServiceOffering;
  platform: Source;
  filterValue: string;
  serviceOffering: ServiceOfferingDetail;
}
export type PlatformReducerActionHandler = ReduxActionHandler<
  PlatformReducerState
>;

export const platformInitialState: PlatformReducerState = {
  platformIconMapping: {},
  sourceTypeIcons: {},
  isPlatformDataLoading: false,
  selectedPlatform: {},
  platforms: [],
  platformItems: {},
  platformInventories: {
    data: [],
    meta: defaultSettings
  },
  platformItem: {},
  platform: {},
  filterValue: '',
  serviceOffering: {
    service: {},
    source: {}
  }
};

const mapPlatformIcons = (
  platformIconMapping: StringObject,
  platforms: Source[],
  sourceTypeIcons: StringObject
) =>
  platforms.reduce<StringObject>(
    (acc, curr) =>
      !acc[curr.id || 'undefined']
        ? {
            ...acc,
            [curr.id || 'undefined']: sourceTypeIcons[
              curr.source_type_id || 'undefined'
            ]
          }
        : acc,
    { ...platformIconMapping }
  );

const setLoadingState: PlatformReducerActionHandler = (
  state,
  { payload = true }
) => ({
  ...state,
  isPlatformDataLoading: payload
});
const setPlatforms: PlatformReducerActionHandler = (state, { payload }) => ({
  ...state,
  platforms: payload,
  platformIconMapping: mapPlatformIcons(
    state.platformIconMapping,
    payload,
    state.sourceTypeIcons
  ),
  isPlatformDataLoading: false
});

const setPlatformItems: PlatformReducerActionHandler = (
  state,
  { payload, meta: { platformId } = {} }
) => ({
  ...state,
  platformItems: {
    ...state.platformItems,
    [platformId!]: payload
  },
  isPlatformDataLoading: false
});
const setMultiplePlatformItems: PlatformReducerActionHandler = (
  state,
  { payload }
) => ({
  ...state,
  platformItems: {
    ...state.platformItems,
    ...payload
  },
  isPlatformDataLoading: false
});
const setPortfolioItems: PlatformReducerActionHandler = (
  state,
  { payload }
) => ({
  ...state,
  portfolioItem: payload,
  isPlatformDataLoading: false
});
const selectPlatform: PlatformReducerActionHandler = (state, { payload }) => ({
  ...state,
  selectedPlatform: payload,
  isLoading: false
});
const filterPlatformItems: PlatformReducerActionHandler = (
  state,
  { payload }
) => ({
  ...state,
  filterValue: payload
});
const setInventoriesDataLoadingState: PlatformReducerActionHandler = (
  state,
  { payload = true }
) => ({
  ...state,
  isInventoriesDataLoading: payload
});
const setPlatformInventories: PlatformReducerActionHandler = (
  state,
  { payload }
) => ({
  ...state,
  platformInventories: payload,
  isInventoriesDataLoading: false
});
const setServiceOffering: PlatformReducerActionHandler = (
  state,
  { payload }
) => ({
  ...state,
  serviceOffering: payload
});
const setSourceTypeIcons: PlatformReducerActionHandler = (
  state,
  { payload }
) => ({
  ...state,
  sourceTypeIcons: payload
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
  [SET_INVENTORIES_LOADING_STATE]: setInventoriesDataLoadingState,
  [`${FETCH_SERVICE_OFFERING}_FULFILLED`]: setServiceOffering,
  [SET_SOURCETYPE_ICONS]: setSourceTypeIcons
};
