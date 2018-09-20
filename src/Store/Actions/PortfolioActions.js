import * as ActionTypes from 'Store/ActionTypes';
import * as PortfolioHelper from 'Helpers/Portfolio/PortfolioHelper';
import ReducerRegistry from 'Utilities/ReducerRegistry';
import { PortfolioReducer } from 'Store/Reducers/PortfolioStore';

ReducerRegistry.register({ PortfolioStore: PortfolioReducer });

export const fetchPortfolioItemsList = apiProps => ({
    type: ActionTypes.FETCH_PORTFOLIO_ITEMS,
    payload: new Promise(resolve => {
        resolve(PortfolioHelper.getPortfolioItems(apiProps));
    })
});

export const fetchSelectedPortfolioItem = id => ({
    type: ActionTypes.FETCH_PORTFOLIO_ITEM,
    payload: new Promise(resolve => {
        resolve(PortfolioHelper.getPortfolioItem(id));
    })
});

export const searchPortfolioItems = value => ({
    type: ActionTypes.FILTER_PORTFOLIO_ITEMS,
    payload: new Promise(resolve => {
        resolve(value);
    })
});
