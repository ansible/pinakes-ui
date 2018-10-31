import React from 'react';

let ServicePortalApi = require('service_portal_api');
let api = new ServicePortalApi.AdminsApi();

export function getServicePlans(portfolioItemId) {
    return api.fetchPlansWithPortfolioItemId(portfolioItemId).then((data) => {
        console.log('fetchPlansWithPortfolioItemID API called successfully. Returned data: ' + data);
        return data;
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

export async function sendSubmitOrder(parameters) {
    let order = await api.newOrder();
    let orderItem = new ServicePortalApi.OrderItem;
    orderItem.count = 1;
    orderItem.provider_control_parameters =  {'namespace': 'default'};
    orderItem.portfolio_item_id = parameters.portfolio_item_id;
    orderItem.service_plan_ref = parameters.service_plan_ref;
    orderItem.service_parameters = parameters.service_parameters;

    await api.addToOrder(order.id, orderItem);
    api.submitOrder(order.id).then((result) => { console.log('Order submitted'); return result; },
        (error)=> {console.error(error);});//submit
}

export function setServicePlan(data) {
    console.log('setServicePlan: ');
    console.log(data);
    return data;
}

;

export function setServiceData(data) {
    console.log('setServiceData: ');
    console.log(data);
    return { serviceData: data };
}

;

