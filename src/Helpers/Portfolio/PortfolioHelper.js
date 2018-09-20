import React from 'react';
import PortfolioItem from 'PresentationalComponents/Portfolio/PortfolioItem';

const InsightsHsdmApi = require('../../../insights_hsdm_api');
const defaultClient = InsightsHsdmApi.ApiClient.instance;
// Configure HTTP basic authorization: UserSecurity
const UserSecurity = defaultClient.authentications['UserSecurity'];
const userApi = new InsightsHsdmApi.UsersApi();
const adminApi = new InsightsHsdmApi.AdminsApi();

export function getPortfolioItems(apiProps) {
  // TODO - use the PORTFOLIO API when available
  return userApi.catalogItems().then((data) => {
      console.log('API called successfully. Returned data: ' + data);
      return processPortfolioItems(data);

  }, (error) => {
      console.error(error);
  });
}

export function getPortfolioItem(portfolioId) {
  // TODO - use the PORTFOLIO API when available
  return userApi.catalogItems().then((data) => {
      console.log('API called successfully. Returned data: ' + data);
      return retrieveSingleItem(data, catalogId);
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

// TODO - use the PORTFOLIO API and portfolio_id when available
function retrieveSingleItem(items, id) {
    let pItem = items.find(item => {return item.catalog_id === id;});
    console.log('RetrieveSingleItem: ');
    console.log(pItem);
    return {portfolioItem: cItem};
}

// TODO - use the PORTFOLIO API and portfolio_id when available
function processPortfolioItem(key, data) {
    return <PortfolioItem key={data.catalog_id} {...data} />;
}


