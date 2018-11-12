import React from 'react';
import PortfolioItem from '../../PresentationalComponents/Portfolio/PortfolioItem';
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

export async function addPortfolioWithItem(portfolioData, item) {
    let portfolio = await userApi.addPortfolio(portfolioData);
    let portfolioItem = await userApi.addPortfolioItem(JSON.stringify({ service_offering_ref: item.id }));
    return userApi.addPortfolioItemToPortfolio(portfolio.id, JSON.stringify({ portfolio_item_id: portfolioItem.id })).then((data) => {
        consoleLog('Add Portfolio Called successfully.');
    }, (error) => {
        window.console.error(error);
    });
}

