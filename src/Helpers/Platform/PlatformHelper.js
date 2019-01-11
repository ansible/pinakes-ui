import { getTopologicalUserApi } from '../Shared/userLogin';

const api = getTopologicalUserApi();

export function getPlatforms() {
  return api.listSources();
}

export function getPlatform(platformId) {
  return api.showSource(platformId).then(data => data, error => console.error(error));
}

export function getPlatformItems(apiProps) {
  let apiPromise = null;

  if (apiProps) {
    apiPromise = api.listSourceServiceOfferings(apiProps);
  } else {
    apiPromise = api.listServiceOfferings();
  }

  return apiPromise;
}
