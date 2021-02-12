import * as ActionTypes from '../action-types';
import * as PlatformHelper from '../../helpers/platform/platform-helper';
import { Dispatch } from 'redux';
import {
  ServiceInventory,
  ServiceOffering,
  Source
} from '@redhat-cloud-services/sources-client';
import { AsyncMiddlewareAction } from '../../types/redux';
import { ApiCollectionResponse, SourceDetails } from '../../types/common-types';
import { PaginationConfiguration } from '../../helpers/shared/pagination';

export const fetchPlatforms = () => (
  dispatch: Dispatch
): Promise<{ type: string; payload: SourceDetails }> => {
  dispatch({ type: `${ActionTypes.FETCH_PLATFORMS}_PENDING` });
  return PlatformHelper.getPlatforms()
    .then((data) =>
      dispatch({
        type: `${ActionTypes.FETCH_PLATFORMS}_FULFILLED`,
        payload: data
      })
    )
    .catch((error) =>
      dispatch({
        type: `${ActionTypes.FETCH_PLATFORMS}_REJECTED`,
        payload: error
      })
    );
};

export const fetchPlatformItems = (
  platformId: string,
  filter: string,
  options: PaginationConfiguration
): AsyncMiddlewareAction<ApiCollectionResponse<ServiceOffering>> => ({
  type: ActionTypes.FETCH_PLATFORM_ITEMS,
  payload: PlatformHelper.getPlatformItems(platformId, filter, options),
  meta: {
    platformId,
    filter,
    ...options
  }
});

export const fetchMultiplePlatformItems = (
  platformsId: string[]
): {
  type: string;
  payload: Promise<
    [] | { [x: string]: ApiCollectionResponse<ServiceOffering> }
  >;
} => {
  const platformPromisses = platformsId.map((platformId) =>
    PlatformHelper.getPlatformItems(platformId).then((data) => ({
      [platformId]: data
    }))
  );
  return {
    type: ActionTypes.FETCH_MULTIPLE_PLATFORM_ITEMS,
    payload: Promise.all(platformPromisses).then((data) =>
      data.reduce(
        (acc, curr) => ({
          ...acc,
          ...curr
        }),
        {}
      )
    )
  };
};

export const fetchSelectedPlatform = (
  id: string
): AsyncMiddlewareAction<Source> => ({
  type: ActionTypes.FETCH_PLATFORM,
  payload: PlatformHelper.getPlatform(id)
});

export const fetchPlatformInventories = (
  platformId: string,
  filter: string,
  options: PaginationConfiguration
): AsyncMiddlewareAction<ApiCollectionResponse<ServiceInventory>> => ({
  type: ActionTypes.FETCH_PLATFORM_INVENTORIES,
  payload: PlatformHelper.getPlatformInventories(platformId, filter, options)
});

export const fetchServiceOffering = (
  serviceOfferingId: string,
  sourceId: string
): AsyncMiddlewareAction<{ service: ServiceOffering; source: Source }> => ({
  type: ActionTypes.FETCH_SERVICE_OFFERING,
  payload: PlatformHelper.getServiceOffering(serviceOfferingId, sourceId)
});
