import * as ActionTypes from '../ActionTypes';
import * as PlatformHelper from '../../Helpers/Platform/PlatformHelper';
import { PlatformReducer } from '../../Store/Reducers/PlatformStore';
import ReducerRegistry from '../../Utilities/ReducerRegistry';

ReducerRegistry.register({ PlatformStore: PlatformReducer });

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
