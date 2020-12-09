import * as ActionTypes from '../action-types';
import * as OrderProcessHelper from '../../helpers/order-process/order-process-helper';
import orderProcessesMessages from '../../messages/order-processes.messages';
import { PaginationConfiguration } from '../../helpers/shared/pagination';
import { Dispatch } from 'redux';
import { AsyncMiddlewareAction, GetReduxState } from '../../types/redux';
import {
  ApiCollectionResponse,
  ReduxAction,
  SortBy
} from '../../types/common-types';
import { Order, OrderProcess } from '@redhat-cloud-services/catalog-client';
import { IntlShape } from 'react-intl';
import { ResourceObject } from '@redhat-cloud-services/approval-client';
import { AxiosResponse } from 'axios';

export const fetchOrderProcesses = (
  pagination?: PaginationConfiguration,
  sortBy?: SortBy
) => (
  dispatch: Dispatch,
  getState: GetReduxState
): AsyncMiddlewareAction<ApiCollectionResponse<Order>> => {
  const { orderProcesses } = getState().orderProcessReducer;

  let finalPagination = pagination;

  if (!pagination && orderProcesses) {
    const { limit, offset } = orderProcesses.meta;
    finalPagination = { limit, offset };
  }

  return dispatch({
    type: ActionTypes.FETCH_ORDER_PROCESSES,
    meta: {
      ...finalPagination,
      sortBy,
      filter: pagination?.filterValue || '',
      storeState: true,
      stateKey: 'orderProcesses'
    },
    payload: OrderProcessHelper.listOrderProcesses(
      pagination?.filterValue,
      sortBy,
      finalPagination
    )
  });
};

export const fetchOrderProcess = (
  id: string
): AsyncMiddlewareAction<OrderProcess> => ({
  type: ActionTypes.FETCH_ORDER_PROCESS,
  payload: OrderProcessHelper.fetchOrderProcess(id)
});

export const addOrderProcess = (
  processData: OrderProcess,
  intl: IntlShape
): AsyncMiddlewareAction<[OrderProcess, OrderProcess | undefined]> => ({
  type: ActionTypes.ADD_ORDER_PROCESS,
  payload: OrderProcessHelper.addOrderProcess(processData),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: intl.formatMessage(
          orderProcessesMessages.addProcessSuccessTitle
        ),
        description: intl.formatMessage(
          orderProcessesMessages.addProcessSuccessDescription
        )
      }
    }
  }
});

export const updateOrderProcess = (
  processId: string,
  data: Partial<OrderProcess>,
  intl: IntlShape
): AsyncMiddlewareAction<OrderProcess> => ({
  type: ActionTypes.UPDATE_ORDER_PROCESS,
  payload: OrderProcessHelper.updateOrderProcess(processId, data),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: intl.formatMessage(
          orderProcessesMessages.updateProcessSuccessTitle,
          { name: data.name }
        )
      }
    }
  }
});

export const sortOrderProcesses = (sortBy: string): ReduxAction<string> => ({
  type: ActionTypes.SORT_ORDER_PROCESSES,
  payload: sortBy
});

export const setOrderProcess = (
  toTag: string[],
  toUntag: string[],
  resourceType: ResourceObject
): AsyncMiddlewareAction<AxiosResponse<void>[]> => ({
  type: ActionTypes.SET_ORDER_PROCESS,
  payload: OrderProcessHelper.setOrderProcesses(toTag, toUntag, resourceType)
});

export const removeOrderProcess = (
  orderProcess: string,
  intl: IntlShape
): AsyncMiddlewareAction<void> => ({
  type: ActionTypes.REMOVE_ORDER_PROCESS,
  payload: OrderProcessHelper.removeOrderProcess(orderProcess),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: intl.formatMessage(
          orderProcessesMessages.removeProcessSuccessTitle
        ),
        description: intl.formatMessage(
          orderProcessesMessages.removeProcessSuccessDescription
        )
      }
    }
  }
});

export const removeOrderProcesses = (
  orderProcesses: string[],
  intl: IntlShape
): AsyncMiddlewareAction<AxiosResponse<void>[]> => ({
  type: ActionTypes.REMOVE_ORDER_PROCESSES,
  payload: OrderProcessHelper.removeOrderProcesses(orderProcesses),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: intl.formatMessage(
          orderProcessesMessages.removeProcessesSuccessTitle
        ),
        description: intl.formatMessage(
          orderProcessesMessages.removeProcessesSuccessDescription
        )
      }
    }
  }
});
