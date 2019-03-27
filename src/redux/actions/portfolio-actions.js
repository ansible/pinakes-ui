import * as ActionTypes from '../action-types';
import * as PortfolioHelper from '../../helpers/portfolio/portfolio-helper';

export const doFetchPortfolios = apiProps => ({
  type: ActionTypes.FETCH_PORTFOLIOS,
  payload: PortfolioHelper.listPortfolios(apiProps).then(({ data }) => data)
});

export const fetchPortfolios = apiProps => (dispatch) => dispatch(doFetchPortfolios(apiProps));

export const fetchPortfolioItems = apiProps => ({
  type: ActionTypes.FETCH_PORTFOLIO_ITEMS,
  payload: PortfolioHelper.getPortfolioItems(apiProps).then(({ data }) => data)
});

export const fetchPortfolioItem = (portfolioItemId) => ({
  type: ActionTypes.FETCH_PORTFOLIO_ITEM,
  payload: PortfolioHelper.getPortfolioItem(portfolioItemId)
});

export const fetchPortfolioItemsWithPortfolio = apiProps => ({
  type: ActionTypes.FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO,
  payload: PortfolioHelper.getPortfolioItemsWithPortfolio(apiProps).then(({ data }) => data)
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
  payload: PortfolioHelper.addPortfolio({
    ...portfolioData,
    workflow_ref: portfolioData.workflow_ref || null
  }, items),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: 'Success adding portfolio',
        description: 'The portfolio was added successfully.'
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
  payload: PortfolioHelper.updatePortfolio({
    ...portfolioData,
    workflow_ref: portfolioData.workflow_ref || null
  }),
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

export const selectPortfolioItem = (portfolioItem) => ({
  type: ActionTypes.SELECT_PORTFOLIO_ITEM,
  payload: portfolioItem
});

export const queryPortfolio = apiProps => ({
  type: ActionTypes.QUERY_PORTFOLIO,
  payload: PortfolioHelper.queryPortfolio(apiProps).then(({ data }) => data)
});

export const sharePortfolio = (portfolioData) => ({
  type: ActionTypes.SHARE_PORTFOLIO,
  payload: PortfolioHelper.sharePortfolio({
    ...portfolioData
  }),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: 'Success updating portfolio',
        description: 'The portfolio was shared successfully.'
      },
      rejected: {
        variant: 'danger',
        title: 'Failed updating portfolio',
        description: 'The portfolio was not shared successfully.'
      }
    }
  }
});

export const unsharePortfolio = (portfolioData) => ({
  type: ActionTypes.UNSHARE_PORTFOLIO,
  payload: PortfolioHelper.unsharePortfolio({
    ...portfolioData
  }),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: 'Success updating portfolio',
        description: 'The portfolio was shared successfully.'
      },
      rejected: {
        variant: 'danger',
        title: 'Failed updating portfolio',
        description: 'The portfolio was not shared successfully.'
      }
    }
  }
});
