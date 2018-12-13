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

  return apiPromise.then(data => data, error => console.error(error));
};
