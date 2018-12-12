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

export const fetchSelectedPortfolio = id => ({
  type: ActionTypes.FETCH_PORTFOLIO,
  payload: new Promise(resolve => {
    resolve(PortfolioHelper.getPortfolio(id));
  })
});

export const searchPortfolioItems = value => ({
  type: ActionTypes.FILTER_PORTFOLIO_ITEMS,
  payload: new Promise(resolve => {
    resolve(value);
  })
});

export const addPortfolio = (portfolioData, items) => ({
  type: ActionTypes.ADD_PORTFOLIO,
  payload: PortfolioHelper.addPortfolio(portfolioData, items)
});

export const addToPortfolio = (portfolioId, items) => ({
    type: ActionTypes.ADD_TO_PORTFOLIO,
    payload: PortfolioHelper.addToPortfolio(portfolioId, items)
});

export const updatePortfolio = (portfolioData) => ({
  type: ActionTypes.UPDATE_PORTFOLIO,
  payload: PortfolioHelper.updatePortfolio(portfolioData)
});
