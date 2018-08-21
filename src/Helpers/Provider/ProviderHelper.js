import React from 'react';


var InsightsHsdmApi = require('../../../insights_hsdm_api');

var defaultClient = InsightsHsdmApi.ApiClient.instance;

// Configure HTTP basic authorization: UserSecurity
var UserSecurity = defaultClient.authentications['UserSecurity'];


var api = new InsightsHsdmApi.UsersApi();



export function getproviderDataFormat(type) {
  return api.listProviders().then((data) => {
    console.log('API called successfully. Returned data: ' + data);
    return data;
  }, (error) => {
    console.error(error);
  });
}

export function addProvider(providerData) {
  return api.addProvider(providerData).then((data) => {
    console.log('Add provider API called successfully. Returned data: ' + data);
    return data;
  }, (error) => {
    console.error(error);
  });
}
