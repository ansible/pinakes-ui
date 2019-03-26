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
