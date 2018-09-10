import * as ActionTypes from 'Store/ActionTypes';
import * as OrderHelper from 'Helpers/Order/OrderHelper';
import ReducerRegistry from 'Utilities/ReducerRegistry';
import { OrderReducer } from 'Store/Reducers/OrderStore';

ReducerRegistry.register({ OrderStore: OrderReducer });

export const fetchServicePlans = (providerId, catalogId) => ({
    type: ActionTypes.FETCH_SERVICE_PLANS,
    payload: OrderHelper.getServicePlans(providerId, catalogId)
});


export const fetchServicePlanParameters = (providerId, catalogId, planId) => ({
  type: ActionTypes.FETCH_SERVICE_PLAN_PARAMETERS,
  payload: OrderHelper.getServicePlanParameters(providerId, catalogId, planId)
});

export const updateServiceData = (data) => ({
  type: ActionTypes.UPDATE_SERVICE_DATA,
  payload: OrderHelper.setServiceData(data)
});

export const sendSubmitOrder = apiProps => ({
  type: ActionTypes.SUBMIT_SERVICE_ORDER,
  payload: new Promise(resolve => {
    resolve(OrderHelper.sendSubmitOrder(apiProps));
  })
});