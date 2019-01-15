import * as ActionTypes from '../ActionTypes';
import * as PortfolioHelper from '../../Helpers/Portfolio/PortfolioHelper';

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
  payload: PortfolioHelper.getPortfolio(id)
});

export const searchPortfolioItems = value => ({
  type: ActionTypes.FILTER_PORTFOLIO_ITEMS,
  payload: new Promise(resolve => {
    resolve(value);
  })
});

export const addPortfolio = (portfolioData, items) => ({
  type: ActionTypes.ADD_PORTFOLIO,
  payload: PortfolioHelper.addPortfolio(portfolioData, items),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: 'Success adding portfolio',
        description: 'The portfolio was added successfully.'
      },
      rejected: {
        variant: 'danger',
        title: 'Failed adding portfolio',
        description: 'The portfolio was not added successfuly.'
      }
    }
  }
});

export const addToPortfolio = (portfolioId, items) => ({
  type: ActionTypes.ADD_TO_PORTFOLIO,
  payload: PortfolioHelper.addToPortfolio(portfolioId, items),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: 'Success adding products',
        description: 'Products were successfully added to portfolio.'
      }
    }
  }
});

export const updatePortfolio = (portfolioData) => ({
  type: ActionTypes.UPDATE_PORTFOLIO,
  payload: PortfolioHelper.updatePortfolio(portfolioData),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: 'Success updating portfolio',
        description: 'The portfolio was updated successfully.'
      },
      rejected: {
        variant: 'danger',
        title: 'Failed updating portfolio',
        description: 'The portfolio was not updated successfuly.'
      }
    }
  }
});

export const removePortfolio = (portfolio) => ({
  type: ActionTypes.REMOVE_PORTFOLIO,
  payload: PortfolioHelper.removePortfolio(portfolio),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: 'Success removing portfolio',
        description: 'The portfolio was removed successfully.'
      }
    }
  }
});
