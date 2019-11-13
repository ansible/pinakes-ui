import React from 'react';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';

import * as ActionTypes from '../action-types';
import * as OrderHelper from '../../helpers/order/order-helper';
import OrderNotification from '../../presentational-components/order/order-notification';

export const fetchServicePlans = (portfolioItemId) => ({
  type: ActionTypes.FETCH_SERVICE_PLANS,
  payload: OrderHelper.getServicePlans(portfolioItemId)
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

const setOrders = orders => ({
  type: ActionTypes.SET_ORDERS,
  payload: orders
});

/**
 * TO DO
 * Update cancel order  optimistic pattern
 */

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
      { ...order, state: 'Canceled' },
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
    description: `Order ${order && order.name || `Order #${orderId}`} was canceled and has been moved to closed orders.`,
    dismissable: true
  })))
  .then(() => dispatch({ type: `${ActionTypes.CANCEL_ORDER}_FULFILLED` }))
  .catch((error) => dispatch({ type: `${ActionTypes.CANCEL_ORDER}_REJECTED`, payload: error }));
};

export const fetchOrders = (...args) => dispatch => {
  dispatch({ type: `${ActionTypes.FETCH_ORDERS}_PENDING` });
  return OrderHelper.getOrders(...args)
  .then(({ portfolioItems, ...orders }) => {
    dispatch({ type: ActionTypes.SET_PORTFOLIO_ITEMS, payload: portfolioItems });
    return dispatch({ type: `${ActionTypes.FETCH_ORDERS}_FULFILLED`, payload: orders });
  })
  .catch(error => dispatch({ type: `${ActionTypes.FETCH_ORDERS}_FULFILLED`, payload: error }));
};

export const fetchOrderDetails = params => dispatch => {
  dispatch({ type: `${ActionTypes.SET_ORDER_DETAIL}_PENDING` });
  return OrderHelper.getOrderDetail(params)
  .then(([ order, orderItem, portfolioItem, platform ]) => dispatch({ type: `${ActionTypes.SET_ORDER_DETAIL}_FULFILLED`, payload: {
    order,
    orderItem,
    portfolioItem,
    platform
  }}));
};
