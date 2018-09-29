import React from 'react';
import PortfolioItem from 'PresentationalComponents/Portfolio/PortfolioItem';
import PlatformItem from 'PresentationalComponents/Portfolio/PlatformItem';

const InsightsHsdmApi = require('../../../insights_hsdm_api');
const defaultClient = InsightsHsdmApi.ApiClient.instance;
// Configure HTTP basic authorization: UserSecurity
const UserSecurity = defaultClient.authentications['UserSecurity'];
const userApi = new InsightsHsdmApi.UsersApi();
const adminApi = new InsightsHsdmApi.AdminsApi();

export function getPlatformItems(apiProps) {
  return userApi.catalogItems().then((data) => {
      console.log('API called successfully. Returned data: ' + data);
      return processPlatformItems(data);

  }, (error) => {
      console.error(error);
  });
}

export function getPlatformItem(platformId) {
  // TODO - use the single catalog API when available
  return userApi.catalogItems().then((data) => {
      console.log('API called successfully. Returned data: ' + data);
      return retrieveSingleItem(data, catalogId);
  }, (error) => {
      console.error(error);
  });
}

export function listPortfolioItems() {
  return adminApi.listPortfolioItems().then((data) => {
    console.log('API called successfully. Returned portfolio Items: ' + data);
    return processPortfolioItems(data);
  }, (error) => {
    console.error(error);
  });
}

export function getPortfolioItem(portfolioId, portfolioItemId) {
  return adminApi.fetchPortfolioItemFromPortfolio(portfolioId, portfolioItemId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
    return data;
  }, (error) => {
    console.error(error);
  });
}

export function getPortfolioItemsWithPortfolio(portfolioId) {
  return adminApi.fetchPortfolioItemsWithPortfolio(portfolioId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
    return data;
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

function processPlatformItems(items) {
  let platformItems = [];
  items.forEach( function(item, row, _array) {
    let newRow = processPlatformItem(row, item);
    platformItems.push(newRow);
  });

  return {platformItems};
}

// TODO - use the PORTFOLIO API and portfolio_id when available
function retrieveSingleItem(items, id) {
    let pItem = items.find(item => {return item.catalog_id === id;});
    console.log('RetrieveSingleItem: ');
    console.log(pItem);
    return {portfolioItem: cItem};
}

// TODO - use the PORTFOLIO API and portfolio_id when available
function processPlatformItem(key, data) {
    return <PlatformItem {...data} />;
}

function processPortfolioItem(key, data) {
  return <PortfolioItem {...data} />;
}

export async function addPortfolioWithItem(portfolioData, item) {
  let portfolio = await adminApi.addPortfolio(portfolioData);
  let portfolioItem = await adminApi.addPortfolioItem(JSON.stringify({name: item.name, description: item.description}));
  return adminApi.addPortfolioItemToPortfolio(portfolio.id, portfolioItem.id).then((data) => {
    console.log('Add Portfolio Called successfully.');
  }, (error) => {
    console.error(error);
  });
}

