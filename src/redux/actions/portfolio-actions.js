import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  ADD_NOTIFICATION,
  CLEAR_NOTIFICATIONS
} from '@redhat-cloud-services/frontend-components-notifications/';

import * as ActionTypes from '../action-types';
import * as PortfolioHelper from '../../helpers/portfolio/portfolio-helper';
import { defaultSettings } from '../../helpers/shared/pagination';

export const doFetchPortfolios = ({
  filter,
  ...options
} = defaultSettings) => ({
  type: ActionTypes.FETCH_PORTFOLIOS,
  meta: { filter },
  payload: PortfolioHelper.listPortfolios(filter, options)
});

export const fetchPortfolios = (...args) => (dispatch) => {
  return dispatch(doFetchPortfolios(...args));
};

export const fetchPortfolioItems = (
  filter = '',
  options = defaultSettings
) => ({
  type: ActionTypes.FETCH_PORTFOLIO_ITEMS,
  meta: { filter },
  payload: PortfolioHelper.listPortfolioItems(
    options.limit,
    options.offset,
    filter
  )
});

export const fetchPortfolioItem = (portfolioItemId) => ({
  type: ActionTypes.FETCH_PORTFOLIO_ITEM,
  payload: PortfolioHelper.getPortfolioItem(portfolioItemId)
});

export const fetchPortfolioItemsWithPortfolio = (
  portfolioId,
  options = defaultSettings
) => ({
  type: ActionTypes.FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO,
  meta: { filter: options.filter },
  payload: PortfolioHelper.getPortfolioItemsWithPortfolio(portfolioId, options)
});

export const fetchSelectedPortfolio = (id) => ({
  type: ActionTypes.FETCH_PORTFOLIO,
  payload: PortfolioHelper.getPortfolio(id)
});

export const searchPortfolioItems = (value) => ({
  type: ActionTypes.FILTER_PORTFOLIO_ITEMS,
  payload: new Promise((resolve) => {
    resolve(value);
  })
});

export const addPortfolio = (portfolioData, items) => (dispatch) => {
  dispatch({
    type: ActionTypes.ADD_TEMPORARY_PORTFOLIO,
    payload: { ...portfolioData, isDisabled: true, isTemporary: true }
  });
  return dispatch({
    type: ActionTypes.ADD_PORTFOLIO,
    payload: PortfolioHelper.addPortfolio(
      {
        ...portfolioData
      },
      items
    )
      .then(() => dispatch(doFetchPortfolios()))
      .catch((error) => {
        dispatch({ type: ActionTypes.RESTORE_PORTFOLIO_PREV_STATE });
        throw error;
      }),
    meta: {
      notifications: {
        fulfilled: {
          variant: 'success',
          title: 'Success adding portfolio',
          description: `Portfolio ${portfolioData.name} was added successfully.`
        }
      }
    }
  });
};

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

export const updatePortfolio = (portfolioData) => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.UPDATE_TEMPORARY_PORTFOLIO,
    payload: portfolioData
  });

  return PortfolioHelper.updatePortfolio(portfolioData, { getState })
    .then(() => dispatch(doFetchPortfolios()))
    .then(() =>
      dispatch({
        type: ADD_NOTIFICATION,
        payload: {
          dismissable: true,
          variant: 'success',
          title: 'Success updating portfolio',
          description: 'The portfolio was updated successfully.'
        }
      })
    )
    .catch((error) => {
      dispatch({ type: ActionTypes.RESTORE_PORTFOLIO_PREV_STATE });
      throw error;
    })
    .catch((error) =>
      dispatch({
        type: `${ActionTypes.UPDATE_TEMPORARY_PORTFOLIO}_REJECTED`,
        payload: error
      })
    );
};

export const removePortfolio = (portfolioId) => (dispatch) => {
  dispatch({
    type: ActionTypes.DELETE_TEMPORARY_PORTFOLIO,
    payload: portfolioId
  });
  return dispatch({
    type: ActionTypes.REMOVE_PORTFOLIO,
    payload: PortfolioHelper.removePortfolio(portfolioId)
      .then(() => dispatch(doFetchPortfolios()))
      .catch((error) => {
        dispatch({ type: ActionTypes.RESTORE_PORTFOLIO_PREV_STATE });
        throw error;
      }),
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
};

export const selectPortfolioItem = (portfolioItem) => ({
  type: ActionTypes.SELECT_PORTFOLIO_ITEM,
  payload: portfolioItem
});

export const undoRemoveProductsFromPortfolio = (restoreData, portfolioId) => (
  dispatch
) => {
  dispatch({ type: `${ActionTypes.RESTORE_PORTFOLIO_ITEMS}_PENDING` });
  return PortfolioHelper.restorePortfolioItems(restoreData)
    .then(() =>
      dispatch({ type: `${ActionTypes.RESTORE_PORTFOLIO_ITEMS}_FULFILLED` })
    )
    .then(() => dispatch({ type: CLEAR_NOTIFICATIONS }))
    .then(() => dispatch(fetchPortfolioItemsWithPortfolio(portfolioId)))
    .then(() =>
      dispatch({
        type: ADD_NOTIFICATION,
        payload: {
          variant: 'success',
          dismissable: true,
          title: 'Products have been restored'
        }
      })
    )
    .catch((err) =>
      dispatch({
        type: `${ActionTypes.RESTORE_PORTFOLIO_ITEMS}_REJECTED`,
        payload: err
      })
    );
};

export const removeProductsFromPortfolio = (portfolioItems, portfolioName) => (
  dispatch,
  getState
) => {
  dispatch({
    type: `${ActionTypes.REMOVE_PORTFOLIO_ITEMS}_PENDING`
  });
  const {
    portfolioReducer: {
      portfolioItems: { meta },
      selectedPortfolio: { id: portfolioId }
    }
  } = getState();
  return PortfolioHelper.removePortfolioItems(portfolioItems)
    .then((data) =>
      dispatch(
        fetchPortfolioItemsWithPortfolio(portfolioId, {
          offset: 0,
          limit: meta.limit,
          filter: ''
        })
      ).then(() => data)
    )
    .then((data) => {
      return dispatch({
        type: ADD_NOTIFICATION,
        payload: {
          variant: 'success',
          title: 'Products removed',
          dismissable: true,
          description: (
            <FormattedMessage
              id="portfolio.remove-portfolio-items"
              defaultMessage={`You have removed {count, number} {count, plural,
            one {product}
            other {products}
          } from the {portfolioName} portfolio. {undo} if this was a mistake.`}
              values={{
                count: portfolioItems.length,
                portfolioName,
                undo: (
                  <a
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      dispatch(
                        undoRemoveProductsFromPortfolio(data, portfolioId)
                      );
                    }}
                  >
                    Undo
                  </a>
                )
              }}
            />
          )
        }
      });
    })
    .then(() =>
      dispatch({ type: `${ActionTypes.REMOVE_PORTFOLIO_ITEMS}_FULFILLED` })
    )
    .catch((err) =>
      dispatch({
        type: `${ActionTypes.REMOVE_PORTFOLIO_ITEMS}_REJECTED`,
        payload: err
      })
    );
};

export const copyPortfolio = (id) => (dispatch) => {
  dispatch({ type: 'COPY_PORTFOLIO_PENDING' });
  return PortfolioHelper.copyPortfolio(id)
    .then((portfolio) => {
      dispatch({ type: 'COPY_PORTFOLIO_FULFILLED' });
      dispatch({
        type: ADD_NOTIFICATION,
        payload: {
          variant: 'success',
          title: 'You have successfully copied a portfolio',
          description: `${portfolio.name} has been copied.`,
          dismissable: true
        }
      });
      return portfolio;
    })
    .catch((err) =>
      dispatch({ type: 'COPY_PORTFOLIO_REJECTED', payload: err })
    );
};

export const copyPortfolioItem = (
  portfolioItemId,
  copyObject,
  newPortfolio
) => (dispatch) => {
  return PortfolioHelper.copyPortfolioItem(portfolioItemId, copyObject)
    .then((data) => {
      dispatch({
        type: ADD_NOTIFICATION,
        payload: {
          variant: 'success',
          title: 'You have successfully copied a product',
          description: `${data.name} has been copied into ${newPortfolio.name}`,
          dismissable: true
        }
      });
      return data;
    })
    .catch((err) =>
      dispatch({ type: 'COPY_PORTFOLIO_ITEM_REJECTED', payload: err })
    );
};

export const resetSelectedPortfolio = () => ({
  type: ActionTypes.RESET_SELECTED_PORTFOLIO
});

export const updatePortfolioItem = (values) => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.UPDATE_TEMPORARY_PORTFOLIO_ITEM,
    payload: values
  });
  return PortfolioHelper.updatePortfolioItem(values, { getState })
    .then(() => {
      dispatch({ type: ActionTypes.UPDATE_PORTFOLIO_ITEM, payload: values });
      return values;
    })
    .then((item) =>
      dispatch({
        type: ADD_NOTIFICATION,
        payload: {
          variant: 'success',
          title: `Product "${item.name}" was successfully updated`,
          dismissable: true
        }
      })
    )
    .catch((error) => {
      dispatch({ type: ActionTypes.RESTORE_PORTFOLIO_ITEM_PREV_STATE });
      throw error;
    })
    .catch((error) =>
      dispatch({
        type: `${ActionTypes.UPDATE_TEMPORARY_PORTFOLIO_ITEM}_REJECTED`,
        payload: error
      })
    );
};

export const getPortfolioItemDetail = (params) => (dispatch, getState) => {
  dispatch({ type: `${ActionTypes.SELECT_PORTFOLIO_ITEM}_PENDING` });
  return PortfolioHelper.getPortfolioItemDetail(params).then(
    ([portfolioItem, source]) =>
      dispatch({
        type: `${ActionTypes.SELECT_PORTFOLIO_ITEM}_FULFILLED`,
        payload: {
          portfolioItem,
          portfolio: getState().portfolioReducer.selectedPortfolio,
          source
        }
      })
  );
};
