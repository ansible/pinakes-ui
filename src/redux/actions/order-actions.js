import React from 'react';
import { Link } from 'react-router-dom';

import * as ActionTypes from '../action-types';
import * as OrderHelper from '../../helpers/order/order-helper';

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

const OrderNotification = () => (
  <p>
    You can track the progress of the order in your <Link to="/orders">Orders</Link> page.
  </p>
);

export const sendSubmitOrder = apiProps => ({
  type: ActionTypes.SUBMIT_SERVICE_ORDER,
  payload: OrderHelper.sendSubmitOrder(apiProps),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: 'Your order has been accepted successfully',
        description: <OrderNotification />,
        dismissable: true
      }
    }
  }
});

export const fetchRequests = () => ({
  type: ActionTypes.FETCH_REQUESTS,
  payload: OrderHelper.listRequests()
});

export const fetchOrderItems = () => ({
  type: ActionTypes.FETCH_ORDER_ITEMS,
  payload: OrderHelper.listOrderItems()
});

const linkOrders = (orders, orderItems, requests) => orders.map(order => ({
  ...order,
  orderItems: orderItems.filter(({ order_id }) => order_id === order.id),
  requests: requests.filter(({ content: { order_id }}) => order_id == order.id) // eslint-disable-line eqeqeq
}));

const separateOrders = orders => orders.reduce((acc, curr) => [ 'Completed', 'Failed' ].includes(curr.state) ? ({
  current: acc.current,
  past: [ ...acc.past, curr ]
}) : ({
  current: [ ...acc.current, curr ],
  past: acc.past
}), { current: [], past: []});

export const getLinkedOrders = () => dispatch => {
  dispatch({ type: `${ActionTypes.FETCH_LINKED_ORDERS}_PENDING` });
  return Promise.all([
    OrderHelper.listOrders().then(response => ({ ...response, data: response.data.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10)) })),
    OrderHelper.listRequests(),
    OrderHelper.listOrderItems()
  ])
  .then(([ orders, requests, orderItems ]) => linkOrders(orders.data, orderItems.data, requests.data))
  .then(linkedOrders => separateOrders(linkedOrders))
  .then(payload => dispatch({
    type: `${ActionTypes.FETCH_LINKED_ORDERS}_FULFILLED`,
    payload
  }));
};