import React from 'react';
import { getTopologicalUserApi } from '../Shared/userLogin';

let ServicePortalApi = require('service_portal_api');
let api = new ServicePortalApi.AdminsApi();

const topoApi = getTopologicalUserApi();

let orderId = 0;

export function getServicePlans(portfolioItemId) {
    return topoApi.listServiceOfferingServicePlans(portfolioItemId).then((data) => {
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

export function sendSubmitOrder(parameters) {
    api.newOrder().then((order) => {
        console.log('Create order called successfully. Returned data: ' + order);
        orderId = order.id;
        let orderItem = new ServicePortalApi.OrderItem;
        orderItem.portfolio_item_id = parameters.portfolio_item_id;
        orderItem.plan_id = parameters.plan_id;
        orderItem.parameters = parameters.plan_parameters;

        api.addToOrder(orderId, orderItem).then((_dataO) => {
            api.submitOrder(orderId).then((result) => { console.log('Order submitted');
                return result;},
            (error)=> {console.error(error);});//submit
        }, (error) => {console.error(error);});
    }, (error) => {
        console.error(error);
    });
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

