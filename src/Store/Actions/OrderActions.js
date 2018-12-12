import * as ActionTypes from '../ActionTypes';
import * as OrderHelper from '../../Helpers/Order/OrderHelper';
import { OrderReducer } from '../../Store/Reducers/OrderStore';
import ReducerRegistry from '../../Utilities/ReducerRegistry';

ReducerRegistry.register({ OrderStore: OrderReducer });

export const fetchServicePlans = (portfolioItemId) => ({
  type: ActionTypes.FETCH_SERVICE_PLANS,
  payload: OrderHelper.getServicePlans(portfolioItemId)
});

export const fetchOrderList = () => ({
  type: ActionTypes.LIST_ORDERS,
  payload: OrderHelper.listOrders()
});

export const updateServiceData = (data) => ({
  type: ActionTypes.UPDATE_SERVICE_DATA,
  payload: { serviceData: data }
});

export const setSelectedPlan = (data) => ({
  type: ActionTypes.SET_SELECTED_PLAN,
  payload: data
});

export const sendSubmitOrder = apiProps => ({
  type: ActionTypes.SUBMIT_SERVICE_ORDER,
  payload: new Promise(resolve => {
    resolve(OrderHelper.sendSubmitOrder(apiProps));
  })
});
