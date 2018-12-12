import React from 'react';
import PortfolioItem from '../../SmartComponents/Portfolio/PortfolioItem';
import { getUserApi } from '../Shared/userLogin';

const userApi = getUserApi();

export function listPortfolios() {
  return userApi.listPortfolios().then(data => data, error => console.error(error));
}

export function getPortfolioItems() {
  return listPortfolioItems();
}

export function listPortfolioItems() {
  return userApi.listPortfolioItems().then(data => processPortfolioItems(data), error => console.error(error));
}

export function getPortfolioItem(portfolioId, portfolioItemId) {
  return userApi.fetchPortfolioItemFromPortfolio(portfolioId, portfolioItemId)
  .then(data => data, error => console.error(error));
}

export function getPortfolio(portfolioId) {
  return userApi.fetchPortfolioWithId(portfolioId).then(data => data, error => console.error(error));
}

export function getPortfolioItemsWithPortfolio(portfolioId) {
  return userApi.fetchPortfolioItemsWithPortfolio(portfolioId)
  .then(data => processPortfolioItems(data), error => console.error(error));
}

function processPortfolioItems(items) {
  return { portfolioItems: items.map((item, row) => processPortfolioItem(row, item)) };
}

// Again why components in Redux?
function processPortfolioItem(data) {
  return <PortfolioItem { ...data } />;
}

// TO DO - change to use the API call that adds multiple items to a portfolio when available
export async function addPortfolio(portfolioData, items) {
    let portfolio = await userApi.addPortfolio(portfolioData);
    if (!portfolio)
    {return portfolio;}

    if (items && items.length > 0) {
        return addToPortfolio(portfolio, items);
    }
  }

export async function addToPortfolio(portfolioId, items) {
    let idx = 0; let newItem = null;

    for (idx = 0; idx < items.length; idx++) {
        consoleLog('Adding service offering: ', items[idx]);
        newItem = await userApi.addPortfolioItem (JSON.stringify ({ service_offering_ref: items[idx] }));
        consoleLog('Added portfolio item: ', newItem);
        if (newItem) {
            let item = await userApi.addPortfolioItemToPortfolio(portfolioId, JSON.stringify({ portfolio_item_id: newItem.id }));
            consoleLog('Added portfolio item: ', item, ' to portfolio: ', portfolioId);
        }
        else {
            consoleLog('Fail to add portfolio item');
        }
    }

    return newItem;
}

export async function updatePortfolio(portfolioData) {
    return userApi.updatePortfolio(portfolioData).then((data) => {
        consoleLog('Update Portfolio Called successfully.');
    }, (error) => {
      window.console.error(error);
    });
  }
}

// Why no .catch block?
export async function updatePortfolio(portfolioData) {
  return userApi.updatePortfolio(portfolioData).then(() => {
    console.log('Update Portfolio Called successfully.');
  }, (error) => {
    window.console.error(error);
  });
}
