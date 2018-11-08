import React from 'react';
import { consoleLog } from '../../Helpers/Shared/Helper';

let ServicePortalApi = require('service_portal_api');
let api = new ServicePortalApi.AdminsApi();

export function getServicePlans(portfolioItemId) {
    return api.fetchPlansWithPortfolioItemId(portfolioItemId).then((data) => {
        consoleLog('fetchPlansWithPortfolioItemID API called successfully. Returned data: ' + data);
        return data;
    }, (error) => {
        window.console.error(error);
    });
}

export function listOrders() {
    return api.listOrders().then((data) => {
        consoleLog('listOrders API called successfully. Returned data: ' + data);
        return data;
    }, (error) => {
        window.console.error(error);
    });
}

export async function sendSubmitOrder(parameters) {
    let order = await api.newOrder();
    let orderItem = new ServicePortalApi.OrderItem;
    orderItem.count = 1;
    orderItem.provider_control_parameters =  { namespace: 'default' };
    orderItem.portfolio_item_id = parameters.portfolio_item_id;
    orderItem.service_plan_ref = parameters.service_plan_ref;
    orderItem.service_parameters = parameters.service_parameters;

    let addResult = await api.addToOrder(order.id, orderItem);
    api.submitOrder(order.id).then((result) => { consoleLog('Order submitted'); return result; },
        (error) => {window.console.error(error);});//submit
}

export function setServicePlan(data) {
    consoleLog('setServicePlan: ');
    consoleLog(data);
    return data;
}

;

export function setServiceData(data) {
    consoleLog('setServiceData: ');
    consoleLog(data);
    return { serviceData: data };
}

;

