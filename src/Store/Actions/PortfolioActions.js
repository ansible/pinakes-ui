import * as ActionTypes from 'Store/ActionTypes';
import * as PortfolioHelper from 'Helpers/Portfolio/PortfolioHelper';
import ReducerRegistry from 'Utilities/ReducerRegistry';
import { PortfolioReducer } from 'Store/Reducers/PortfolioStore';

ReducerRegistry.register({ PortfolioStore: PortfolioReducer });

export const fetchPlatformItems = apiProps => ({
    type: ActionTypes.FETCH_PLATFORM_ITEMS,
    payload: new Promise(resolve => {
        resolve(PortfolioHelper.getPlatformItems(apiProps));
    })
});

export const fetchSelectedPlatformItem = id => ({
    type: ActionTypes.FETCH_PLATFORM_ITEM,
    payload: new Promise(resolve => {
        resolve(PortfolioHelper.getPlatformItem(id));
    })
});

export const searchPlatformItems = value => ({
    type: ActionTypes.FILTER_PLATFORM_ITEMS,
    payload: new Promise(resolve => {
        resolve(value);
    })
});


export const fetchPortfolioItems = apiProps => ({
  type: ActionTypes.FETCH_PORTFOLIO_ITEMS,
  payload: new Promise(resolve => {
    resolve(PortfolioHelper.listPortfolioItems(apiProps));
  })
});

export const fetchPortfolios = apiProps => ({
  type: ActionTypes.FETCH_PORTFOLIOS,
  payload: new Promise(resolve => {
    resolve(PortfolioHelper.listPortfolios(apiProps));
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
  payload: new Promise(resolve => {
    resolve(PortfolioHelper.addPortfolioWithItem(portfolioData, itemData));
  })
});


