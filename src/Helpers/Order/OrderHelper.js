import React from 'react';

let ServicePortalApi = require('service_portal_api');
let api = new ServicePortalApi.AdminsApi();

let orderId = 0;

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
        orderId = order.id;
        let orderItem = new ServicePortalApi.OrderItem;
        orderItem.provider_id = parameters.provider_id;
        orderItem.catalog_id= parameters.catalog_id;
        orderItem.plan_id = parameters.plan_id
        orderItem.parameters= parameters.plan_parameters;

        api.addToOrder(orderId, orderItem).then((_dataO) => {
            api.submitOrder(orderId).then((result) => { console.log('Order submitted');
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


