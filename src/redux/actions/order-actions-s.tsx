import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';

import * as ActionTypes from '../action-types';
import * as OrderHelper from '../../helpers/order/order-helper-s';
import OrderNotification from '../../presentational-components/order/order-notification';
import { defaultSettings } from '../../helpers/shared/pagination';
import {
  ApprovalRequestStateEnum,
  Order,
  OrderItem,
  OrderStateEnum,
  Portfolio,
  PortfolioItem,
  ProgressMessage
} from '@redhat-cloud-services/catalog-client';
import { AnyObject } from '@data-driven-forms/react-form-renderer';
import { Dispatch } from 'redux';
import { Full, StringObject, ReduxAction } from '../../types/common-types';
import { ApiCollectionResponse } from '../../types/common-types-s';
import { AsyncMiddlewareAction, GetReduxState } from '../../types/redux';
import { Source } from '@redhat-cloud-services/sources-client';
import {
  ObjectNotFound,
  ProgressMessageItem
} from '../../helpers/order/new-order-helper';
import { GetOrderDetailParams } from '../../helpers/order/order-helper';
import {
  getServicePlans,
  ServicePlan
} from '../../helpers/order/service-plan-helper-s';
import React from 'react';

export const fetchServicePlans = (
  portfolioItemId: string
): AsyncMiddlewareAction<ApiCollectionResponse<ServicePlan>> => ({
  type: ActionTypes.FETCH_SERVICE_PLANS,
  payload: getServicePlans(portfolioItemId)
});

export const setSelectedPlan = (
  data: ServicePlan
): ReduxAction<ServicePlan> => ({
  type: ActionTypes.SET_SELECTED_PLAN,
  payload: data
});

export const sendSubmitOrder = (
  apiProps: AnyObject,
  portfolioItem: Full<PortfolioItem>
) => (dispatch: Dispatch): AsyncMiddlewareAction =>
  dispatch({
    type: ActionTypes.SUBMIT_SERVICE_ORDER,
    payload: OrderHelper.sendSubmitOrder(apiProps, portfolioItem).then(
      ({ id, orderItem }) =>
        dispatch(
          addNotification({
            variant: 'success',
            title: 'Your order has been accepted successfully',
            description: (
              <OrderNotification
                id={id!}
                dispatch={dispatch}
                portfolioItemId={portfolioItem.id}
                portfolioId={portfolioItem.portfolio_id}
                platformId={portfolioItem.service_offering_source_ref}
                orderItemId={orderItem.id!}
              />
            ),
            dismissable: true
          })
        )
    )
  });

export const cancelOrder = (orderId: string) => (
  dispatch: Dispatch,
  getState: GetReduxState
): Promise<void | { type: string }> => {
  dispatch({ type: `${ActionTypes.CANCEL_ORDER}_PENDING` });
  const {
    orderReducer: { orderDetail }
  } = getState();
  return OrderHelper.cancelOrder(orderId)
    .then(() => {
      orderDetail.order.state = OrderStateEnum.Canceled;
      if (
        orderDetail.approvalRequest &&
        orderDetail.approvalRequest.data.length > 0
      ) {
        orderDetail.approvalRequest.data[0].state = 'canceled' as ApprovalRequestStateEnum;
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
          description: `${`Order #${orderDetail.order.id}`} was canceled.`,
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

export const fetchOrders = (
  filters: StringObject,
  pagination = defaultSettings
) => (dispatch: Dispatch): Promise<ReduxAction> => {
  let queryFilter = Object.entries(filters)
    .filter(([, value]) => value && value.length > 0)
    .map(([key, value]) =>
      Array.isArray(value)
        ? value.map((value) => `${key}=${value}`).join('&')
        : `${key}=${value}`
    )
    .join('&');
  if (pagination.sortBy) {
    queryFilter = `${queryFilter}&sort_by=${
      pagination.sortBy
    }:${pagination.sortDirection || 'desc'}`;
  }

  dispatch({ type: `${ActionTypes.FETCH_ORDERS}_PENDING` });
  return OrderHelper.getOrders(queryFilter, pagination)
    .then(({ ...orders }) => {
      return dispatch({
        type: `${ActionTypes.FETCH_ORDERS}_FULFILLED`,
        meta: {
          ...pagination,
          filter: queryFilter,
          filters,
          storeState: true,
          stateKey: 'orders'
        },
        payload: orders
      });
    })
    .catch((error) => {
      return dispatch({
        type: `${ActionTypes.FETCH_ORDERS}_REJECTED`,
        payload: error
      });
    });
};

export const fetchOrderDetails = (params: GetOrderDetailParams) => (
  dispatch: Dispatch
): Promise<{
  type: string;
  payload: {
    order: Order | ObjectNotFound;
    orderItem: OrderItem | ObjectNotFound;
    portfolioItem: PortfolioItem | ObjectNotFound;
    platform: Source | ObjectNotFound;
    progressMessages: ProgressMessage | ObjectNotFound;
    portfolio: Portfolio | ObjectNotFound;
  };
}> => {
  dispatch({ type: `${ActionTypes.SET_ORDER_DETAIL}_PENDING` });
  // @ts-ignore
  return OrderHelper.getOrderDetail(params)
    .then(
      ([
        order,
        orderItem,
        portfolioItem,
        platform,
        progressMessages,
        portfolio
      ]) =>
        dispatch({
          type: `${ActionTypes.SET_ORDER_DETAIL}_FULFILLED`,
          payload: {
            order,
            orderItem,
            portfolioItem,
            platform,
            progressMessages,
            portfolio
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

export const fetchApprovalRequests = (orderItemId: string) => (
  dispatch: Dispatch
): Promise<
  | {
      data: {
        group_name: string;
        decision: string;
        updated?: string | undefined;
      }[];
    }
  | { type: string; payload: any } /** the action in catch branch */
> => {
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

export const fetchOrderProvision = (orderId: string) => (
  dispatch: Dispatch
): Promise<{
  type: string;
  payload: {
    orderItems: OrderItem[] | [];
    progressMessageItems: ProgressMessageItem[] | [];
  };
}> => {
  dispatch({ type: `${ActionTypes.SET_ORDER_PROVISION_ITEMS}_PENDING` });
  // @ts-ignore
  return OrderHelper.getOrderProvisionItems(orderId)
    .then(({ orderItems, progressMessageItems }) =>
      dispatch({
        type: `${ActionTypes.SET_ORDER_PROVISION_ITEMS}_FULFILLED`,
        payload: {
          orderItems,
          progressMessageItems
        }
      })
    )
    .catch((error) =>
      dispatch({
        type: `${ActionTypes.SET_ORDER_PROVISION_ITEMS}_REJECTED`,
        payload: error
      })
    );
};
