import * as ActionTypes from 'Store/ActionTypes';
import * as ProviderHelper from 'Helpers/Provider/ProviderHelper';
import ReducerRegistry from 'Utilities/ReducerRegistry';
import { ProviderReducer } from 'Store/Reducers/ProviderStore';

ReducerRegistry.register({ ProviderStore: ProviderReducer });

export const fetchproviderDataFormat = apiProps => ({
    type: ActionTypes.FETCH_PROVIDER_DATA,
    payload: new Promise(resolve => {
        resolve(ProviderHelper.getproviderDataFormat(apiProps));
    })
});

export const addProvider = apiProps => ({
  type: ActionTypes.ADD_PROVIDER,
  payload: new Promise(resolve => {
    resolve(ProviderHelper.addProvider(apiProps));
  })
});
