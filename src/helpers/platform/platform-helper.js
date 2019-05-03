import { getAxiosInstance, getSourcesApi, getTopologocalInventoryApi } from '../shared/user-login';
import { TOPOLOGICAL_INVENTORY_API_BASE } from '../../utilities/constants';

const sourcesApi = getSourcesApi();
const topologicalApi = getTopologocalInventoryApi();
const axiosInstance = getAxiosInstance();

export function getPlatforms() {
  return sourcesApi.listSources();
}

export function getPlatform(platformId) {
  return sourcesApi.showSource(platformId);
}

export function getPlatformItems(apiProps, options) {
  let apiPromise = null;

  if (apiProps) {
    apiPromise = axiosInstance.get(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/${apiProps}/service_offerings?filter[archived_at][nil]${options
      ? `&limit=${options.limit}&offset=${options.offset}`
      : ''}`);
  } else {
    apiPromise = topologicalApi.listServiceOfferings();
  }

  return apiPromise;
}
