import * as ActionTypes from '../ActionTypes';
import * as PortfolioHelper from '../../Helpers/Portfolio/PortfolioHelper';
import { PortfolioReducer } from '../../Store/Reducers/PortfolioStore';
import ReducerRegistry from '../../Utilities/ReducerRegistry';

ReducerRegistry.register({ PortfolioStore: PortfolioReducer });

export const fetchPortfolios = apiProps => ({
    type: ActionTypes.FETCH_PORTFOLIOS,
    payload: new Promise(resolve => {
        resolve(PortfolioHelper.listPortfolios(apiProps));
    })
});

export const fetchPortfolioItems = apiProps => ({
    type: ActionTypes.FETCH_PORTFOLIO_ITEMS,
    payload: new Promise(resolve => {
        resolve(PortfolioHelper.getPortfolioItems(apiProps));
    })
});

export const fetchPortfolioItemsWithPortfolio = apiProps => ({
    type: ActionTypes.FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO,
    payload: new Promise(resolve => {
        resolve(PortfolioHelper.getPortfolioItemsWithPortfolio(apiProps));
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

export const addPortfolioWithItem = (portfolioData, itemData) => ({
    type: ActionTypes.ADD_PORTFOLIO,
    payload: PortfolioHelper.addPortfolioWithItem(portfolioData, itemData)
});
