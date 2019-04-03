import { getTopologicalUserApi } from '../shared/user-login';
import { TOPOLOGICAL_INVENTORY_API_BASE } from '../../utilities/constants';

const api = getTopologicalUserApi();

export function getPlatforms() {
  return api.listSources();
}

export function getPlatform(platformId) {
  return api.showSource(platformId);
}

export function getPlatformItems(apiProps, options) {
  let apiPromise = null;

  if (apiProps) {
    apiPromise = fetch(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/${apiProps}/service_offerings?filter[archived_at][nil]${options
      ? `&limit=${options.limit}&offset=${options.offset}`
      : ''}`).then(data =>  data.json());
  } else {
    apiPromise = api.listServiceOfferings();
  }

  return apiPromise;
}
