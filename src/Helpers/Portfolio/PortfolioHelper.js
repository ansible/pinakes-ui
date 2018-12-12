import React from 'react';
import PortfolioItem from '../../SmartComponents/Portfolio/PortfolioItem';
import { getUserApi } from '../Shared/userLogin';
import { consoleLog } from '../../Helpers/Shared/Helper';

const userApi = getUserApi();

export function listPortfolios() {
    return userApi.listPortfolios().then((data) => {
        consoleLog('API called successfully. Returned portfolios: ' + data);
        return data;
    }, (error) => {
        window.console.error(error);
    });
}

export function getPortfolioItems(apiProps) {
    return listPortfolioItems();
}

export function listPortfolioItems() {
    return userApi.listPortfolioItems().then((data) => {
        consoleLog('API called successfully. Returned portfolio Items: ' + data);
        return processPortfolioItems(data);
    }, (error) => {
        window.console.error(error);
    });
}

export function getPortfolioItem(portfolioId, portfolioItemId) {
    return userApi.fetchPortfolioItemFromPortfolio(portfolioId, portfolioItemId).then((data) => {
        consoleLog('API called successfully. Returned data: ' + data);
        return data;
    }, (error) => {
        window.console.error(error);
    });
}

export function getPortfolio(portfolioId) {
    return userApi.fetchPortfolioWithId(portfolioId).then((data) => {
        consoleLog('API called successfully. Returned data: ' + data);
        return data;
    }, (error) => {
        window.console.error(error);
    });
}

export function getPortfolioItemsWithPortfolio(portfolioId) {
    return userApi.fetchPortfolioItemsWithPortfolio(portfolioId).then((data) => {
        consoleLog('fetchPortfolioItemsWithPortfolio API called successfully. Returned data: ' + data);
        return processPortfolioItems(data);
    }, (error) => {
        window.console.error(error);
    });
}

function processPortfolioItems(items) {
    let portfolioItems = [];
    items.forEach(function(item, row, _array) {
        let newRow = processPortfolioItem(row, item);
        portfolioItems.push(newRow);
    });

    return {
        portfolioItems
    };
}

function processPortfolioItem(key, data) {
    return <PortfolioItem { ...data } />;
}

// TO DO - change to use the API call that adds multiple items to a portfolio when available
export async function addPortfolio(portfolioData, items) {
    let portfolio = await userApi.addPortfolio(portfolioData);

    let portfolioItems = [];
    let idx = 0;
    if (portfolio && items && items.length > 0) {
        for (idx = 0; idx < items.length; idx++) {
            consoleLog('Adding service offering: ', items[idx]);
            let newItem = await userApi.addPortfolioItem (JSON.stringify ({ service_offering_ref: items[idx].id }));
            consoleLog('Added portfolio item: ', newItem);
            if (newItem) {
                let item = await userApi.addPortfolioItemToPortfolio(portfolio.id, JSON.stringify({portfolio_item_id: newItem.id}));
                consoleLog('Added portfolio item: ', item);
            }
            else {
                consoleLog('Fail to add portfolio item');
            }
        }
    }
    else {
        return portfolio;
    }
}


export async function addToPortfolio(portfolioId, items) {
    let portfolioItems = [];
    let idx = 0;
    if (portfolioId && items && items.length > 0) {
        for (idx = 0; idx < items.length; idx++) {
            consoleLog('Adding service offering: ', items[idx]);
            let newItem = await userApi.addPortfolioItem (JSON.stringify ({ service_offering_ref: items[idx] }));
            consoleLog('Added portfolio item: ', newItem);
            if (newItem) {
                let item = await userApi.addPortfolioItemToPortfolio(portfolioId, JSON.stringify({portfolio_item_id: newItem.id}));
                consoleLog('Added portfolio item: ', item, ' to portfolio: ', portfolioId);
            }
            else {
                consoleLog('Fail to add portfolio item');
            }
        }
    }
    else {
        return null;
    }
};

export async function updatePortfolio(portfolioData) {
    return userApi.updatePortfolio(portfolioData).then((data) => {
        consoleLog('Update Portfolio Called successfully.');
    }, (error) => {
        window.console.error(error);
    });
}
