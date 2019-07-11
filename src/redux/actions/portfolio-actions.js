import React from 'react';
import { FormattedMessage } from 'react-intl';
import { ADD_NOTIFICATION, CLEAR_NOTIFICATIONS } from '@redhat-cloud-services/frontend-components-notifications/';

import * as ActionTypes from '../action-types';
import * as PortfolioHelper from '../../helpers/portfolio/portfolio-helper';

export const doFetchPortfolios = apiProps => ({
  type: ActionTypes.FETCH_PORTFOLIOS,
  payload: PortfolioHelper.listPortfolios(apiProps)
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

export const undoRemoveProductsFromPortfolio = (restoreData, portfolioId) => dispatch => {
  dispatch({ type: `${ActionTypes.RESTORE_PORTFOLIO_ITEMS}_PENDING` });
  return PortfolioHelper.restorePortfolioItems(restoreData)
  .then(() => dispatch({ type: `${ActionTypes.RESTORE_PORTFOLIO_ITEMS}_FULFILLED` }))
  .then(() => dispatch({ type: CLEAR_NOTIFICATIONS }))
  .then(() => dispatch(fetchPortfolioItemsWithPortfolio(portfolioId)))
  .then(() => dispatch({
    type: ADD_NOTIFICATION,
    payload: {
      variant: 'success',
      dismissable: true,
      title: 'Products have been restored'
    }
  }))
  .catch(err => dispatch({
    type: `${ActionTypes.RESTORE_PORTFOLIO_ITEMS}_REJECTED`,
    payload: err
  }));
};

export const removeProductsFromPortfolio = (portfolioItems, portfolioName) => (dispatch, getState) => {
  dispatch({
    type: `${ActionTypes.REMOVE_PORTFOLIO_ITEMS}_PENDING`
  });
  const { portfolioReducer: { selectedPortfolio: { id: portfolioId }}} = getState();
  return PortfolioHelper.removePortfolioItems(portfolioItems)
  .then(data => dispatch(fetchPortfolioItemsWithPortfolio(portfolioId)).then(() => data))
  .then(data => {
    return dispatch({
      type: ADD_NOTIFICATION,
      payload: {
        variant: 'success',
        title: 'Products removed',
        dismissable: true,
        description: (
          <FormattedMessage
            id="portfolio.remove-portfolio-items"
            defaultMessage={ `You have removed {count, number} {count, plural,
            one {product}
            other {products}
          } from the {portfolioName} portfolio. {undo} if this was a mistake.` }
            values={ {
              count: portfolioItems.length,
              portfolioName,
              undo: <a href="javascript:void(0)"><span onClick={ () => dispatch(undoRemoveProductsFromPortfolio(data, portfolioId)) }>Undo</span></a>
            } }
          />
        )
      }
    });})
  .then(() => dispatch({ type: `${ActionTypes.REMOVE_PORTFOLIO_ITEMS}_FULFILLED` }))
  .catch(err => dispatch({ type: `${ActionTypes.REMOVE_PORTFOLIO_ITEMS}_REJECTED`, payload: err }));
};

export const copyPortfolio = id => dispatch => {
  dispatch({ type: 'COPY_PORTFOLIO_PENDING' });
  return PortfolioHelper.copyPortfolio(id)
  .then(portfolio => {
    dispatch({ type: 'COPY_PORTFOLIO_FULFILLED' });
    dispatch({ type: ADD_NOTIFICATION, payload: { variant: 'success', title: 'You have successfully copied a portfolio' }});
    return portfolio;
  })
  .catch(err => dispatch({ type: 'COPY_PORTFOLIO_REJECTED', payload: err }));
};

export const copyPortfolioItem = (portfolioItemId, copyObject, newPortfolio) => dispatch => {
  return PortfolioHelper.copyPortfolioItem(portfolioItemId, copyObject)
  .then(data => {
    dispatch({ type: ADD_NOTIFICATION, payload: {
      variant: 'success',
      title: 'You have successfully copied a product',
      description: `${data.display_name} has been copied into ${newPortfolio.name}`,
      dismissable: true
    }});
    return data;
  })
  .catch(err => dispatch({ type: 'COPY_PORTFOLIO_ITEM_REJECTED', payload: err }));
};

