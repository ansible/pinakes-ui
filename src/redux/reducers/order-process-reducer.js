import {
  FETCH_ORDER_PROCESSES,
  SORT_ORDER_PROCESSES,
  SET_FILTER_ORDER_PROCESSES
} from '../../redux/action-types';

// Initial State
export const orderProcessInitialState = {
  orderProcesses: {
    data: [],
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
  }
};

const setLoadingState = (state) => ({ ...state, isLoading: true });
const setOrderProcesses = (state, { payload }) => ({
  ...state,
  orderProcesses: payload,
  isLoading: false
});
const setSortOrderProcesses = (state, { payload }) => ({
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
const setFilterValue = (state, { payload }) => ({
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
