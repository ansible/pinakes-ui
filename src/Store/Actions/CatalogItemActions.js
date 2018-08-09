import * as ActionTypes from 'Store/ActionTypes';
import * as CatalogItemHelper from 'Helpers/CatalogItem/CatalogItemHelper';
import ReducerRegistry from 'Utilities/ReducerRegistry';
import { CatalogItemReducer } from 'Store/Reducers/CatalogItemStore';

ReducerRegistry.register({ CatalogStore: CatalogItemReducer });

export const fetchCatalogItemsList = apiProps => ({
    type: ActionTypes.FETCH_CATALOG_ITEMS,
    payload: new Promise(resolve => {
        resolve(CatalogItemHelper.getCatalogItems(apiProps));
    })
});

export const fetchSelectedCatalogItem = id => ({
    type: ActionTypes.FETCH_CATALOG_ITEM,
    payload: new Promise(resolve => {
        resolve(CatalogItemHelper.getCatalogItem(id));
    })
});

export const searchCatalogItems = value => ({
    type: ActionTypes.FILTER_CATALOG_ITEMS,
    payload: new Promise(resolve => {
        resolve(value);
    })
});
