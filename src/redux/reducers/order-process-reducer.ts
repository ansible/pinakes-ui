import {
  FETCH_ORDER_PROCESSES,
  SORT_ORDER_PROCESSES,
  SET_FILTER_ORDER_PROCESSES
} from '../action-types';
import {
  ApiCollectionResponse,
  AnyObject,
  ReduxActionHandler
} from '../../types/common-types';
import { OrderProcess } from '@redhat-cloud-services/catalog-client';

export interface OrderProcessReducerState extends AnyObject {
  orderProcesses: ApiCollectionResponse<OrderProcess>;
  isLoading: boolean;
  selectedOrderProcesses: string[];
}

export type OrderProcessReducerActionHandler = ReduxActionHandler<
  OrderProcessReducerState
>;
// Initial State
export const orderProcessInitialState: OrderProcessReducerState = {
  orderProcesses: {
    data: [],
    results: [],
    meta: {
      count: 0,
      limit: 50,
      offset: 0
    }
  },
  filterValue: '',
  isLoading: false,
  sortBy: {
    index: 0,
    property: 'name',
    direction: 'asc'
  },
  selectedOrderProcesses: []
};

const setLoadingState: OrderProcessReducerActionHandler = (state) => ({
  ...state,
  isLoading: true
});
const setOrderProcesses: OrderProcessReducerActionHandler = (
  state,
  { payload }
) => ({
  ...state,
  orderProcesses: payload,
  isLoading: false
});
const setSortOrderProcesses: OrderProcessReducerActionHandler = (
  state,
  { payload }
) => ({
  ...state,
  sortBy: payload,
  orderProcesses: {
    ...state.orderProcesses,
    meta: {
      ...state.orderProcesses.meta,
      offset: 0
    }
  }
});
const setFilterValue: OrderProcessReducerActionHandler = (
  state,
  { payload }
) => ({
  ...state,
  filterValue: payload,
  orderProcesses: {
    ...state.orderProcesses,
    meta: {
      ...state.orderProcesses.meta,
      offset: 0
    }
  }
});

export default {
  [`${FETCH_ORDER_PROCESSES}_PENDING`]: setLoadingState,
  [`${FETCH_ORDER_PROCESSES}_FULFILLED`]: setOrderProcesses,
  [SORT_ORDER_PROCESSES]: setSortOrderProcesses,
  [SET_FILTER_ORDER_PROCESSES]: setFilterValue
};
