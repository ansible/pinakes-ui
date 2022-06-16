import React, { ReactNode } from 'react';
import {
  ADD_NOTIFICATION,
  CLEAR_NOTIFICATIONS
} from '@redhat-cloud-services/frontend-components-notifications/redux';

import * as ActionTypes from '../action-types';
import * as PortfolioHelper from '../../helpers/portfolio/portfolio-helper-s';
import {
  defaultSettings,
  PaginationConfiguration
} from '../../helpers/shared/pagination';

import portfolioMessages from '../../messages/portfolio.messages';
import { FormattedMessage } from 'react-intl';
import { AsyncMiddlewareAction, GetReduxState } from '../../types/redux';
import {
  ApiCollectionResponse,
  Full,
  InternalPortfolio,
  NotificationPayload,
  ReduxAction,
  RestorePortfolioItemConfig,
  StringObject
} from '../../types/common-types-s';
import { Portfolio } from '@redhat-cloud-services/catalog-client';
import { PortfolioItem } from '../../helpers/portfolio/portfolio-helper-s';
import { AnyAction, Dispatch } from 'redux';
import { AnyObject } from '@data-driven-forms/react-form-renderer';
import { ServiceOffering } from '@redhat-cloud-services/sources-client';

export const doFetchPortfolios = ({
  filters,
  ...options
} = defaultSettings): AsyncMiddlewareAction<ApiCollectionResponse<
  InternalPortfolio
>> => ({
  type: ActionTypes.FETCH_PORTFOLIOS,
  meta: { ...defaultSettings, filters, ...options },
  payload: PortfolioHelper.listPortfolios(filters, options)
});

export const fetchPortfolios = (options?: PaginationConfiguration) => (
  dispatch: Dispatch
): AsyncMiddlewareAction<ApiCollectionResponse<Portfolio>> =>
  dispatch(
    doFetchPortfolios(options) as Full<
      AsyncMiddlewareAction<ApiCollectionResponse<Portfolio>>
    >
  );

export const fetchPortfoliosWithState = (
  filters: StringObject,
  options = defaultSettings
) => (
  dispatch: Dispatch
): AsyncMiddlewareAction<ApiCollectionResponse<Portfolio>> =>
  dispatch(
    doFetchPortfolios({
      ...options,
      filters,
      storeState: true,
      stateKey: 'portfolio'
    }) as Full<AsyncMiddlewareAction<ApiCollectionResponse<Portfolio>>>
  );

export const fetchPortfolioItems = (
  filter = '',
  options = defaultSettings
): AsyncMiddlewareAction<ApiCollectionResponse<PortfolioItem>> => ({
  type: ActionTypes.FETCH_PORTFOLIO_ITEMS,
  meta: { filter, storeState: true, stateKey: 'products' },
  payload: PortfolioHelper.listPortfolioItems(
    options?.limit,
    options?.offset,
    filter
  )
});

export const fetchPortfolioItemsWithPortfolio = (
  portfolioId: string,
  options = defaultSettings
): AsyncMiddlewareAction<ApiCollectionResponse<PortfolioItem>> => ({
  type: ActionTypes.FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO,
  payload: PortfolioHelper.getPortfolioItemsWithPortfolio(portfolioId, options),
  meta: {
    ...options,
    storeState: true,
    stateKey: 'portfolioItems'
  }
});

export const fetchSelectedPortfolio = (
  id: string
): AsyncMiddlewareAction<Portfolio> => ({
  type: ActionTypes.FETCH_PORTFOLIO,
  payload: PortfolioHelper.getPortfolio(id)
});

export const addPortfolio = (
  portfolioData: Partial<Portfolio>,
  notification: AnyObject
): AsyncMiddlewareAction<Portfolio> => ({
  type: ActionTypes.ADD_PORTFOLIO,
  payload: PortfolioHelper.addPortfolio(portfolioData),
  meta: {
    notifications: {
      fulfilled: notification
    }
  }
});

export const addToPortfolio = (
  portfolioId: string,
  items: PortfolioItem[]
): AsyncMiddlewareAction<PortfolioItem[]> => ({
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

export const updatePortfolio = (
  portfolioData: Partial<Portfolio>,
  options?: PaginationConfiguration
) => (
  dispatch: Dispatch,
  getState: GetReduxState
): Promise<NotificationPayload> => {
  dispatch({
    type: ActionTypes.UPDATE_TEMPORARY_PORTFOLIO,
    payload: portfolioData
  });

  return PortfolioHelper.updatePortfolio(portfolioData, { getState })
    .then(() =>
      dispatch(
        doFetchPortfolios(options) as Full<
          AsyncMiddlewareAction<ApiCollectionResponse<Portfolio>>
        >
      )
    )
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

export const undoRemovePortfolio = (
  portfolioId: string,
  restoreKey: string,
  viewState: PaginationConfiguration
) => (
  dispatch: Dispatch
): Promise<AsyncMiddlewareAction<ApiCollectionResponse<Portfolio>>> => {
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
      return dispatch(
        (fetchPortfolios(viewState) as unknown) as Full<
          AsyncMiddlewareAction<ApiCollectionResponse<Portfolio>>
        >
      );
    }
  );
};

export const removePortfolio = (portfolioId: string, viewState = {}) => (
  dispatch: Dispatch,
  getState: GetReduxState
): AsyncMiddlewareAction<AnyAction> => {
  dispatch({
    type: ActionTypes.DELETE_TEMPORARY_PORTFOLIO,
    payload: portfolioId
  });
  return dispatch({
    type: ActionTypes.REMOVE_PORTFOLIO,
    payload: PortfolioHelper.removePortfolio(portfolioId)
      .then((data) => {
        dispatch({
          type: ADD_NOTIFICATION,
          payload: {
            variant: 'success',
            title: 'Success removing portfolio',
            dismissable: true,
            description: (
              <FormattedMessage
                {...portfolioMessages.removePortfolioOnlyNotification}
              />
            )
          }
        });
        const { meta, results } = getState().portfolioReducer.portfolios;
        return dispatch(
          (fetchPortfolios({
            ...viewState,
            ...meta,
            offset: results?.length === 0 ? 0 : meta?.offset
          }) as unknown) as AnyAction
        );
      })
      .catch((error) => {
        dispatch({ type: ActionTypes.RESTORE_PORTFOLIO_PREV_STATE });
        throw error;
      })
  });
};

export const undoRemoveProductsFromPortfolio = (
  restoreData: RestorePortfolioItemConfig[],
  portfolioId: string
) => (dispatch: Dispatch): Promise<AnyAction> => {
  dispatch({ type: `${ActionTypes.RESTORE_PORTFOLIO_ITEMS}_PENDING` });
  return PortfolioHelper.restorePortfolioItems(restoreData)
    .then(() =>
      dispatch({ type: `${ActionTypes.RESTORE_PORTFOLIO_ITEMS}_FULFILLED` })
    )
    .then(() => dispatch({ type: CLEAR_NOTIFICATIONS }))
    .then(() =>
      dispatch(
        (fetchPortfolioItemsWithPortfolio(portfolioId) as unknown) as AnyAction
      )
    )
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

export const removeProductsFromPortfolio = (
  portfolioItems: string[],
  portfolioName: string,
  firstSelectedProduct: PortfolioItem
) => (
  dispatch: (...args: any[]) => Promise<void>,
  getState: GetReduxState
): Promise<void> => {
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
        fetchPortfolioItemsWithPortfolio(portfolioId!, {
          offset: 0,
          limit: meta?.limit || defaultSettings.limit,
          filter: ''
        })
      ).then(() => data)
    )
    .then((data) =>
      dispatch({
        type: ADD_NOTIFICATION,
        payload: {
          variant: 'success',
          title: 'Products removed',
          dismissable: true,
          description: (
            <FormattedMessage
              {...portfolioMessages.removeItemsNotification}
              values={{
                count: portfolioItems.length,
                productName: firstSelectedProduct.name,
                portfolioName,
                // eslint-disable-next-line react/display-name
                b: (chunks: ReactNode) => <b>{chunks}</b>,
                // eslint-disable-next-line react/display-name
                a: (chunks: ReactNode) => (
                  <a
                    href="#"
                    id={`restore-portfolio-item-${portfolioId}`}
                    onClick={(event) => {
                      event.preventDefault();
                      dispatch(
                        undoRemoveProductsFromPortfolio(data, portfolioId!)
                      );
                    }}
                  >
                    {chunks}
                  </a>
                )
              }}
            />
          )
        }
      })
    )
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

export const copyPortfolio = (id: string) => (
  dispatch: Dispatch
): Promise<Portfolio | AnyAction> => {
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
  portfolioItemId: string,
  copyObject: Partial<PortfolioItem>,
  newPortfolio: Full<Portfolio>
) => (dispatch: Dispatch): Promise<PortfolioItem | AnyAction> => {
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

export const resetSelectedPortfolio = (): AnyAction => ({
  type: ActionTypes.RESET_SELECTED_PORTFOLIO
});

export const updatePortfolioItem = (values: Partial<PortfolioItem>) => (
  dispatch: Dispatch,
  getState: GetReduxState
): Promise<NotificationPayload | AnyAction> => {
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

export const getPortfolioItemDetail = (
  params: PortfolioHelper.GetPortfolioItemDetailParams
) => (dispatch: Dispatch): Promise<AnyAction> => {
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

export const setOrFetchPortfolio = (
  id: string,
  portfolios: ApiCollectionResponse<Portfolio>
): { type: string; payload: Portfolio } | AsyncMiddlewareAction<Portfolio> => {
  const existingPorfolio = portfolios?.results?.find(
    (portfolio) => portfolio.id === id
  );

  if (existingPorfolio) {
    return {
      type: `${ActionTypes.FETCH_PORTFOLIO}_FULFILLED`,
      payload: existingPorfolio
    };
  }

  return fetchSelectedPortfolio(id);
};
