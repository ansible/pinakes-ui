import * as ActionTypes from 'Store/ActionTypes';
import * as PlatformHelper from 'Helpers/Platform/PlatformHelper';
import ReducerRegistry from 'Utilities/ReducerRegistry';
import { PlatformReducer } from 'Store/Reducers/PlatformStore';

ReducerRegistry.register({ PlatformStore: PlatformReducer });

export const fetchproviderDataFormat = apiProps => ({
    type: ActionTypes.FETCH_PLATFORM_DATA,
    payload: new Promise(resolve => {
        resolve(PlatformHelper.getproviderDataFormat(apiProps));
    })
});

export const addPlatform = apiProps => ({
  type: ActionTypes.ADD_PLATFORM,
  payload: new Promise(resolve => {
    resolve(PlatformHelper.addPlatform(apiProps));
  })
});
