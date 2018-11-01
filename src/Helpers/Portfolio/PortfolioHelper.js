import React from 'react';
import PortfolioItem from '../../PresentationalComponents/Portfolio/PortfolioItem';
import { getUserApi } from '../Shared/userLogin';

const userApi = getUserApi();

export function listPortfolios() {
    return userApi.listPortfolios().then((data) => {
        console.log('API called successfully. Returned portfolios: ' + data);
        return data;
    }, (error) => {
        console.error(error);
    });
}

export function getPortfolioItems(apiProps) {
    return listPortfolioItems();
}

export function listPortfolioItems() {
    return userApi.listPortfolioItems().then((data) => {
        console.log('API called successfully. Returned portfolio Items: ' + data);
        return processPortfolioItems(data);
    }, (error) => {
        console.error(error);
    });
}

export function getPortfolioItem(portfolioId, portfolioItemId) {
    return userApi.fetchPortfolioItemFromPortfolio(portfolioId, portfolioItemId).then((data) => {
        console.log('API called successfully. Returned data: ' + data);
        return data;
    }, (error) => {
        console.error(error);
    });
}

export function getPortfolioItemsWithPortfolio(portfolioId) {
    return userApi.fetchPortfolioItemsWithPortfolio(portfolioId).then((data) => {
        console.log('fetchPortfolioItemsWithPortfolio API called successfully. Returned data: ' + data);
        return processPortfolioItems(data);
    }, (error) => {
        console.error(error);
    });
}

function processPortfolioItems(items) {
    let portfolioItems = [];
    items.forEach( function(item, row, _array) {
        let newRow = processPortfolioItem(row, item);
        portfolioItems.push(newRow);
    });

    return {
        portfolioItems,
    };
}

function processPortfolioItem(key, data) {
    return <PortfolioItem {...data} />;
}

export async function addPortfolioWithItem(portfolioData, item) {
    let portfolio = await userApi.addPortfolio(portfolioData);
    let portfolioItem = await userApi.addPortfolioItem(JSON.stringify({name: item.name, description: item.description}));
    return userApi.addPortfolioItemToPortfolio(portfolio.id, portfolioItem.id, portfolioItem).then((data) => {
        console.log('Add Portfolio Called successfully.');
    }, (error) => {
        console.error(error);
    });
}

