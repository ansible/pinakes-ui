import React from 'react';


var InsightsHsdmApi = require('../../../insights_hsdm_api');

var defaultClient = InsightsHsdmApi.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
var UserSecurity = defaultClient.authentications['UserSecurity'];


var api = new InsightsHsdmApi.UsersApi();



export function getServicePlans(providerId, catalogId) {
  return api.fetchPlansWithProviderAndCatalogID(providerId, catalogId).then((data) => {
    console.log('fetchPlansWithProviderAndCatalogID API called successfully. Returned data: ' + data);
    return data;
  }, (error) => {
    console.error(error);
  });
}

export function getServicePlanParameters(providerId, catalogId, planId) {
  return api.catalogPlanParameters(providerId, catalogId, planId).then((data) => {
    console.log('catalogPlanParameters API called successfully. Returned data: ' + data);
    return data;
  }, (error) => {
    console.error(error);
  });
}

export function setServiceData(data) {
  console.log('setServiceData: ');
  console.log(data);
  return {serviceData: data};
};


export function bindMethods (context, methods) {
  methods.forEach(method => {
    context[method] = context[method].bind(context);
  });
};
