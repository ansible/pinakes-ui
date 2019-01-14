import * as ActionTypes from '../ActionTypes';
import * as PlatformHelper from '../../Helpers/Platform/PlatformHelper';

export const fetchPlatforms = () => ({
  type: ActionTypes.FETCH_PLATFORMS,
  payload: new Promise(resolve => {
    resolve(PlatformHelper.getPlatforms());
  })
});

export const fetchPlatformItems = platformId => ({
  type: ActionTypes.FETCH_PLATFORM_ITEMS,
  payload: PlatformHelper.getPlatformItems(platformId),
  meta: {
    platformId
  }
});

export const fetchMultiplePlatformItems = platformsId => {
  const platformPromisses = platformsId.map(platformId => PlatformHelper.getPlatformItems(platformId).then(data => ({ [platformId]: data })));
  return {
    type: ActionTypes.FETCH_MULTIPLE_PLATFORM_ITEMS,
    payload: Promise.all(platformPromisses).then(data => data.reduce((acc, curr) => ({
      ...acc,
      ...curr
    }), {}))
  };
};

export const fetchSelectedPlatform = id => ({
  type: ActionTypes.FETCH_PLATFORM,
  payload: new Promise(resolve => {
    resolve(PlatformHelper.getPlatform(id));
  })
});

export const searchPlatformItems = value => ({
  type: ActionTypes.FILTER_PLATFORM_ITEMS,
  payload: new Promise(resolve => {
    resolve(value);
  })
});
