import React from 'react';
import OrderItem from  '../../../insights_hsdm_api/src/model/OrderItem';

var InsightsHsdmApi = require('../../../insights_hsdm_api');

var defaultClient = InsightsHsdmApi.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
var UserSecurity = defaultClient.authentications['UserSecurity'];


var api = new InsightsHsdmApi.UsersApi();

let order_id = 0;

export function getServicePlans(providerId, catalogId) {
  return api.fetchPlansWithProviderAndCatalogID(providerId, catalogId).then((data) => {
    console.log('fetchPlansWithProviderAndCatalogID API called successfully. Returned data: ' + data);
    return data;
  }, (error) => {
    console.error(error);
  });
}

export function getServicePlanParameters(providerId, catalogId, planId) {
  return api.catalogPlanSchema(providerId, catalogId, planId).then((data) => {
    console.log('catalogPlanParameters API called successfully. Returned data: ' + data['schema']);
    return data['schema'];
  }, (error) => {
    console.error(error);
  });
}

export function listOrders() {
  return api.listOrders().then((data) => {
    console.log('listOrders API called successfully. Returned data: ' + data);
    return data;
  }, (error) => {
    console.error(error);
  });
}

export function sendSubmitOrder(parameters) {
  api.newOrder().then((order) => {
    console.log('Create order called successfully. Returned data: ' + order);
    order_id = order.id;
    let orderItem = new OrderItem;
    orderItem.provider_id = parameters.provider_id;
    orderItem.catalog_id= parameters.catalog_id;
    orderItem.plan_id = parameters.plan_id
    orderItem.parameters= parameters.plan_parameters;

    api.addToOrder(order_id, orderItem).then((_dataO) => {
      api.submitOrder(order_id).then((result) => { console.log('Order submitted');
                                                return result;},
          (error)=> {console.error(error)})//submit
    },(error) => {console.error(error)})
  }, (error) => {
    console.error(error);
  });
}

export function setServicePlan(data) {
  console.log('setServicePlan: ');
  console.log(data);
  return data;
};

export function setServiceData(data) {
  console.log('setServiceData: ');
  console.log(data);
  return {serviceData: data};
};


