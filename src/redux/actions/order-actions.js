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
      orderDetail.order.state = 'Canceled';
      if (
        orderDetail.approvalRequest &&
        orderDetail.approvalRequest.length > 0
      ) {
        orderDetail.approvalRequest[0].state = 'canceled';
      }

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

export const fetchOrders = (filters, pagination) => (dispatch) => {
  const queryFilter = Object.entries(filters)
    .filter(([, value]) => value && value.length > 0)
    .map(([key, value]) =>
      Array.isArray(value)
        ? value.map((value) => `filter[${key}][]=${value}`).join('&')
        : `filter[${key}][contains_i]=${value}`
    )
    .join('&');
  dispatch({ type: `${ActionTypes.FETCH_ORDERS}_PENDING` });
  return OrderHelper.getOrders(queryFilter, pagination)
    .then(({ portfolioItems, ...orders }) => {
      dispatch({
        type: ActionTypes.SET_PORTFOLIO_ITEMS,
        payload: portfolioItems
      });
      return dispatch({
        type: `${ActionTypes.FETCH_ORDERS}_FULFILLED`,
        meta: { filter: queryFilter },
        payload: orders
      });
    })
    .catch((error) =>
      dispatch({
        type: `${ActionTypes.FETCH_ORDERS}_REJECTED`,
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

export const fetchApprovalRequests = (orderItemId) => (dispatch) => {
  dispatch({ type: `${ActionTypes.FETCH_APPROVAL_REQUESTS}_PENDING` });
  return OrderHelper.getApprovalRequests(orderItemId)
    .then((data) => {
      dispatch({
        type: `${ActionTypes.FETCH_APPROVAL_REQUESTS}_FULFILLED`,
        payload: data
      });
      return data;
    })
    .catch((err) =>
      dispatch({
        type: `${ActionTypes.FETCH_APPROVAL_REQUESTS}_REJECTED`,
        payload: err
      })
    );
};
