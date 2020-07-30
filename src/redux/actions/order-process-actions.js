import * as ActionTypes from '../action-types';
import * as OrderProcessHelper from '../../helpers/order-process/order-process-helper';

export const fetchOrderProcesses = (pagination) => (dispatch, getState) => {
  const {
    sortBy,
    orderProcesses,
    filterValue
  } = getState().orderProcessReducer;

  let finalPagination = pagination;

  if (!pagination && orderProcesses) {
    const { limit, offset } = orderProcesses.meta;
    finalPagination = { limit, offset };
  }

  return dispatch({
    type: ActionTypes.FETCH_ORDER_PROCESSES,
    payload: OrderProcessHelper.listOrderProcesses(
      filterValue,
      finalPagination,
      sortBy
    )
  });
};

export const addOrderProcess = (processData) => ({
  type: ActionTypes.ADD_ORDER_PROCESS,
  payload: OrderProcessHelper.addOrderProcess(processData),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: 'Success adding order process',
        description: 'The order process was added successfully.'
      }
    }
  }
});

export const sortOrderProcesses = (sortBy) => ({
  type: ActionTypes.SORT_ORDER_PROCESSES,
  payload: sortBy
});

export const setFilterValueOrderProcesses = (filterValue) => ({
  type: ActionTypes.SET_FILTER_ORDER_PROCESSES,
  payload: filterValue
});
