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

export const sendSubmitOrder = (apiProps) => (dispatch) =>
  dispatch({
    type: ActionTypes.SUBMIT_SERVICE_ORDER,
    payload: OrderHelper.sendSubmitOrder(apiProps).then(({ id }) =>
      dispatch(
        addNotification({
          variant: 'success',
          title: 'Your order has been accepted successfully',
          description: <OrderNotification id={id} dispatch={dispatch} />,
          dismissable: true
        })
      )
    )
  });

export const fetchRequests = () => ({
  type: ActionTypes.FETCH_REQUESTS,
  payload: OrderHelper.listRequests()
});

export const cancelOrder = (orderId) => (dispatch, getState) => {
  dispatch({ type: `${ActionTypes.CANCEL_ORDER}_PENDING` });
  const {
    orderReducer: { orderDetail }
  } = getState();
  return OrderHelper.cancelOrder(orderId)
    .then(() => {
      (orderDetail.order.state = 'Canceled'),
        (orderDetail.approvalRequest[0].status = 'canceled');
      dispatch({
        type: ActionTypes.SET_ORDER_DETAIL,
        payload: { ...orderDetail }
      });
      return orderDetail;
    })
    .then((orderDetail) =>
      dispatch(
        addNotification({
          variant: 'success',
          title: 'Your order has been canceled successfully',
          description: `Order ${`Order #${orderDetail.order.id}`} was canceled.`,
          dismissable: true
        })
      )
    )
    .then(() => dispatch({ type: `${ActionTypes.CANCEL_ORDER}_FULFILLED` }))
    .catch((error) => {
      dispatch({
        type: `${ActionTypes.CANCEL_ORDER}_REJECTED`,
        payload: error
      });
    });
};

export const fetchOrders = (filterType, filter, pagination) => (dispatch) => {
  dispatch({ type: `${ActionTypes.FETCH_ORDERS}_PENDING` });
  return OrderHelper.getOrders(filterType, filter, pagination)
    .then(({ portfolioItems, ...orders }) => {
      dispatch({
        type: ActionTypes.SET_PORTFOLIO_ITEMS,
        payload: portfolioItems
      });
      return dispatch({
        type: `${ActionTypes.FETCH_ORDERS}_FULFILLED`,
        meta: { filter },
        payload: orders
      });
    })
    .catch((error) =>
      dispatch({
        type: `${ActionTypes.FETCH_ORDERS}_FULFILLED`,
        payload: error
      })
    );
};

export const fetchOrderDetails = (params) => (dispatch) => {
  dispatch({ type: `${ActionTypes.SET_ORDER_DETAIL}_PENDING` });
  return OrderHelper.getOrderDetail(params)
    .then(
      ([
        order,
        orderItem,
        portfolioItem,
        platform,
        progressMessages,
        portfolio,
        approvalRequest
      ]) =>
        dispatch({
          type: `${ActionTypes.SET_ORDER_DETAIL}_FULFILLED`,
          payload: {
            order,
            orderItem,
            portfolioItem,
            platform,
            progressMessages,
            portfolio,
            approvalRequest
          }
        })
    )
    .catch((error) =>
      dispatch({
        type: `${ActionTypes.SET_ORDER_DETAIL}_REJECTED`,
        payload: error
      })
    );
};
