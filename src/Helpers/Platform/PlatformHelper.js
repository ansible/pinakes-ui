import React from 'react';
import PlatformItem from '../../PresentationalComponents/Platform/PlatformItem';
import { getTopologicalUserApi } from '../Shared/userLogin';

const api = getTopologicalUserApi();

export function getPlatforms() {
  return api.listSources().then((data) => {
    console.log('listSources API called successfully. Returned platforms: ' + data);
    return data;
  }, (error) => {
    console.error(error);
  });
}

export function getPlatformItems(apiProps) {
  console.log('getPlatformItems called with : ' + apiProps.platform);
  let apiPromise = null;
  if( apiProps && apiProps.platform) {
    // TODO - replace with offerings per source when available
    apiPromise = api.listServiceOfferings();
  }
  else {
    apiPromise = api.listServiceOfferings();
  }

  return apiPromise.then((data) => {
      console.log('API called successfully. Returned data: ' + data);
      return processPlatformItems(data);
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

