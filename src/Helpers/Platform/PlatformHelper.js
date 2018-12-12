import React from 'react';
import PlatformItem from '../../PresentationalComponents/Platform/PlatformItem';
import { getTopologicalUserApi } from '../Shared/userLogin';

const api = getTopologicalUserApi();

export function getPlatforms() {
  return api.listSources().then(data => data, error => console.error(error));
}

export function getPlatformItems(apiProps) {
  let apiPromise = null;
  if (apiProps && apiProps.platform) {
    // TODO - replace with offerings per source when available
    apiPromise = api.listSourceServiceOfferings(apiProps.platform);
  }
  else {
    apiPromise = api.listServiceOfferings();
  }

  return apiPromise.then(data => processPlatformItems(data), error => console.error(error));
}

function processPlatformItems(items) {
  return { platformItems: items.map((item, row) => processPlatformItem(row, item)) };
}

// remove rendering from Helper
// Also why storing React components into Redux?
function processPlatformItem(key, data) {
  return <PlatformItem key={ key } { ...data } />;
}

