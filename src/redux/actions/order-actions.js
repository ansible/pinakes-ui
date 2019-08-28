import React from 'react';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';

import * as ActionTypes from '../action-types';
import * as OrderHelper from '../../helpers/order/order-helper';
import OrderNotification from '../../presentational-components/order/order-notification';

export const fetchServicePlans = (portfolioItemId) => ({
  type: ActionTypes.FETCH_SERVICE_PLANS,
  payload: OrderHelper.getServicePlans(portfolioItemId)
});

export const fetchOrderList = () => ({
  type: ActionTypes.LIST_ORDERS,
  payload: OrderHelper.listOrders().then(({ data }) => data)
});

export const updateServiceData = (data) => ({
  type: ActionTypes.UPDATE_SERVICE_DATA,
  payload: { serviceData: data }
});

export const setSelectedPlan = (data) => ({
  type: ActionTypes.SET_SELECTED_PLAN,
  payload: data
});

export const sendSubmitOrder = apiProps => dispatch => dispatch({
  type: ActionTypes.SUBMIT_SERVICE_ORDER,
  payload: OrderHelper.sendSubmitOrder(apiProps).then(({ id }) => dispatch(addNotification({
    variant: 'success',
    title: 'Your order has been accepted successfully',
    description: <OrderNotification id={ id } dispatch={ dispatch } />,
    dismissable: true
  })))
});

export const fetchRequests = () => ({
  type: ActionTypes.FETCH_REQUESTS,
  payload: OrderHelper.listRequests()
});

export const fetchOrderItems = () => ({
  type: ActionTypes.FETCH_ORDER_ITEMS,
  payload: OrderHelper.listOrderItems()
});

const setOrders = orders => ({
  type: ActionTypes.SET_ORDERS,
  payload: orders
});

export const cancelOrder = orderId => (dispatch, getState) => {
  dispatch({ type: `${ActionTypes.CANCEL_ORDER}_PENDING` });
  return OrderHelper.cancelOrder(orderId)
  .then(() => {
    const { openOrders, closedOrders } = getState().orderReducer;
    let orderIndex;
    const order = openOrders.data.find(({ id }, index) => {
      if (id === orderId) {
        orderIndex = index;
        return true;
      }

      return false;
    });
    const open = [ ...openOrders.data.slice(0, orderIndex), ...openOrders.data.slice(orderIndex + 1) ];
    const closed = [
      { ...order, state: 'Canceled', requests: order.requests.map(item => ({ ...item, state: 'canceled' })) },
      ...closedOrders.data
    ];
    dispatch(setOrders({
      openOrders: {
        ...openOrders,
        data: open
      },
      closedOrders: {
        ...closedOrders,
        data: closed
      }}));
    return order;
  })
  .then((order) => dispatch(addNotification({
    variant: 'success',
    title: 'Your order has been canceled successfully',
    description: `Order ${order.requests[0] && order.requests[0].name || `Order #${orderId}`} was canceled and has been moved to closed orders.`,
    dismissable: true
  })))
  .then(() => dispatch({ type: `${ActionTypes.CANCEL_ORDER}_FULFILLED` }))
  .catch((error) => dispatch({ type: `${ActionTypes.CANCEL_ORDER}_REJECTED`, payload: error }));
};

export const fetchOpenOrders = (...args) => dispatch => {
  dispatch({ type: `${ActionTypes.FETCH_OPEN_ORDERS}_PENDING` });
  return OrderHelper.getOpenOrders(...args)
  .then(({ portfolioItems, ...orders }) => {
    dispatch({ type: ActionTypes.SET_PORTFOLIO_ITEMS, payload: portfolioItems });
    return dispatch({ type: `${ActionTypes.FETCH_OPEN_ORDERS}_FULFILLED`, payload: orders });
  })
  .catch(error => dispatch({ type: `${ActionTypes.FETCH_OPEN_ORDERS}_FULFILLED`, payload: error }));
};

export const fetchCloseOrders = (...args) => dispatch => {
  dispatch({ type: `${ActionTypes.FETCH_CLOSED_ORDERS}_PENDING` });
  return OrderHelper.getClosedOrders(...args)
  .then(({ portfolioItems, ...orders }) => {
    dispatch({ type: ActionTypes.SET_PORTFOLIO_ITEMS, payload: portfolioItems });
    return dispatch({ type: `${ActionTypes.FETCH_CLOSED_ORDERS}_FULFILLED`, payload: orders });
  })
  .catch(error => dispatch({ type: `${ActionTypes.FETCH_CLOSED_ORDERS}_FULFILLED`, payload: error }));
};
