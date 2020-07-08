import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  ADD_NOTIFICATION,
  CLEAR_NOTIFICATIONS
} from '@redhat-cloud-services/frontend-components-notifications/cjs/actionTypes';

import * as ActionTypes from '../action-types';
import * as PortfolioHelper from '../../helpers/portfolio/portfolio-helper';
import { defaultSettings } from '../../helpers/shared/pagination';

export const doFetchPortfolios = ({
  filter,
  ...options
} = defaultSettings) => ({
  type: ActionTypes.FETCH_PORTFOLIOS,
  meta: { ...defaultSettings, filter, ...options },
  payload: PortfolioHelper.listPortfolios(filter, options)
});

export const fetchPortfolios = (options) => (dispatch) =>
  dispatch(doFetchPortfolios(options));

export const fetchPortfoliosWithState = (options = defaultSettings) => (
  dispatch
) =>
  dispatch(
    doFetchPortfolios({ ...options, storeState: true, stateKey: 'portfolio' })
  );

export const fetchPortfolioItems = (
  filter = '',
  options = defaultSettings
) => ({
  type: ActionTypes.FETCH_PORTFOLIO_ITEMS,
  meta: { filter, storeState: true, stateKey: 'products' },
  payload: PortfolioHelper.listPortfolioItems(
    options.limit,
    options.offset,
    filter
  )
});

export const fetchPortfolioItemsWithPortfolio = (
  portfolioId,
  options = defaultSettings
) => ({
  type: ActionTypes.FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO,
  payload: PortfolioHelper.getPortfolioItemsWithPortfolio(portfolioId, options),
  meta: {
    ...options,
    storeState: true,
    stateKey: 'portfolioItems'
  }
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

export const addPortfolio = (portfolioData) => ({
  type: ActionTypes.ADD_PORTFOLIO,
  payload: PortfolioHelper.addPortfolio(portfolioData),
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

export const updatePortfolio = (portfolioData, options) => (
  dispatch,
  getState
) => {
  dispatch({
    type: ActionTypes.UPDATE_TEMPORARY_PORTFOLIO,
    payload: portfolioData
  });

  return PortfolioHelper.updatePortfolio(portfolioData, { getState })
    .then(() => dispatch(doFetchPortfolios(options)))
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

export const undoRemovePortfolio = (portfolioId, restoreKey, viewState) => (
  dispatch
) => {
  dispatch({ type: CLEAR_NOTIFICATIONS });
  return PortfolioHelper.undeletePortfolio(portfolioId, restoreKey).then(
    (portfolio) => {
      dispatch({
        type: ADD_NOTIFICATION,
        payload: {
          variant: 'success',
          dismissable: true,
          title: `Portfolio ${portfolio.name} has been restored`
        }
      });
      return dispatch(fetchPortfolios(viewState));
    }
  );
};

export const removePortfolio = (portfolioId, viewState = {}) => (
  dispatch,
  getState
) => {
  dispatch({
    type: ActionTypes.DELETE_TEMPORARY_PORTFOLIO,
    payload: portfolioId
  });
  return dispatch({
    type: ActionTypes.REMOVE_PORTFOLIO,
    payload: PortfolioHelper.removePortfolio(portfolioId)
      .then(({ restore_key }) => {
        dispatch({
          type: ADD_NOTIFICATION,
          payload: {
            variant: 'success',
            title: 'Success removing portfolio',
            dismissable: true,
            description: (
              <Fragment>
                The portfolio was removed successfully. You can&nbsp;
                <a
                  href="#"
                  id={`undo-delete-portfolio-${portfolioId}`}
                  onClick={(event) => {
                    event.preventDefault();
                    dispatch(
                      undoRemovePortfolio(portfolioId, restore_key, viewState)
                    );
                  }}
                >
                  Undo
                </a>
                &nbsp;this action if this was a mistake.
              </Fragment>
            )
          }
        });
        const { meta, data } = getState().portfolioReducer.portfolios;
        return dispatch(
          fetchPortfolios({
            ...viewState,
            ...meta,
            offset: data.length === 0 ? 0 : meta.offset
          })
        );
      })
      .catch((error) => {
        dispatch({ type: ActionTypes.RESTORE_PORTFOLIO_PREV_STATE });
        throw error;
      })
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
              id="portfolio.remove.portfolio-items"
              defaultMessage="You have removed {count, number} {count, plural, one {product} other {products} } from the {portfolioName} portfolio. {undo} if this was a mistake." // eslint-disable-line max-len
              values={{
                count: portfolioItems.length,
                portfolioName,
                undo: (
                  <a
                    href="#"
                    id={`restore-portfolio-item-${portfolioId}`}
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
    .then((data) => {
      dispatch({ type: ActionTypes.UPDATE_PORTFOLIO_ITEM, payload: data });
      return data;
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

export const getPortfolioItemDetail = (params) => (dispatch) => {
  dispatch({ type: `${ActionTypes.SELECT_PORTFOLIO_ITEM}_PENDING` });
  return PortfolioHelper.getPortfolioItemDetail(params).then(
    ([portfolioItem, source]) =>
      dispatch({
        type: `${ActionTypes.SELECT_PORTFOLIO_ITEM}_FULFILLED`,
        payload: {
          portfolioItem,
          source
        }
      })
  );
};
