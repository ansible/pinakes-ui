import * as ActionTypes from 'Store/ActionTypes';
import * as PlatformHelper from 'Helpers/Platform/PlatformHelper';
import ReducerRegistry from 'Utilities/ReducerRegistry';
import { PlatformReducer } from 'Store/Reducers/PlatformStore';
import { addAlert } from './AlertActions';

ReducerRegistry.register({ PlatformStore: PlatformReducer });

export const fetchproviderDataFormat = apiProps => ({
    type: ActionTypes.FETCH_PLATFORM_DATA,
    payload: new Promise(resolve => {
        resolve(PlatformHelper.getproviderDataFormat(apiProps));
    })
});

export const addPlatform = (apiProps) => dispatch => ({
  type: ActionTypes.ADD_PLATFORM,
  payload: new Promise((resolve, reject) => {
    resolve(PlatformHelper.addPlatform(apiProps));
  })
  .then(() =>
    dispatch(addAlert({
      variant: 'success',
      title: 'Success adding platform',
      description: 'The platform was added successfully.'
  })))
  .catch(() =>
    dispatch(addAlert({
      variant: 'danger',
      title: 'Failed adding platform',
      description: 'The platform was not added successfuly.'
  })))
});
