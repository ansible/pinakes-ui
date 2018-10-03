import React from 'react';
import PlatformItem from 'PresentationalComponents/Platform/PlatformItem';

import { getUserApi } from '../Shared/userLogin';

const api = getUserApi();
export function getPlatforms() {
  return api.listProviders().then((data) => {
    console.log('API called successfully. Returned platforms: ' + data);
    return data;
  }, (error) => {
    console.error(error);
  });
}

export function getPlatformItems(apiProps) {
  console.log('getPlatformItems called with : ' + apiProps.platform);
  let apiPromise = null;
  if( apiProps && apiProps.platform) {
    apiPromise = api.fetchCatalogItemWithProvider(apiProps.platform);
  }
  else {
    apiPromise = api.catalogItems();
  }

  return apiPromise.then((data) => {
      console.log('API called successfully. Returned data: ' + data);
      return processPlatformItems(data);
  }, (error) => {
      console.error(error);
  });
}

export function getPlatformItem(platformId) {
  // TODO - use the single catalog API when available
  return api.catalogItems().then((data) => {
      console.log('API called successfully. Returned data: ' + data);
      return retrieveSingleItem(data, catalogId);
  }, (error) => {
      console.error(error);
  });
}

function processPlatformItems(items) {
  let platformItems = [];
  items.forEach( function(item, row, _array) {
    let newRow = processPlatformItem(row, item);
    platformItems.push(newRow);
  });

  return {platformItems};
}

function processPlatformItem(key, data) {
    return <PlatformItem key={key} {...data} />;
}

