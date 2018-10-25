import * as ActionTypes from '../../Store/ActionTypes';
import * as CatalogItemHelper from '../../Helpers/CatalogItem/CatalogItemHelper';
import { CatalogItemReducer } from '../../Store/Reducers/CatalogItemStore';
import ReducerRegistry from '../../Utilities/ReducerRegistry';

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
