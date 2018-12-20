import * as ActionTypes from '../ActionTypes';
import * as PlatformHelper from '../../Helpers/Platform/PlatformHelper';

export const fetchPlatforms = () => ({
  type: ActionTypes.FETCH_PLATFORMS,
  payload: new Promise(resolve => {
    resolve(PlatformHelper.getPlatforms());
  })
});

export const fetchPlatformItems = apiProps => ({
  type: ActionTypes.FETCH_PLATFORM_ITEMS,
  payload: new Promise(resolve => {
    resolve(PlatformHelper.getPlatformItems(apiProps));
  })
});

export const searchPlatformItems = value => ({
  type: ActionTypes.FILTER_PLATFORM_ITEMS,
  payload: new Promise(resolve => {
    resolve(value);
  })
});
