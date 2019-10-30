import { getAxiosInstance, getSourcesApi, getTopologocalInventoryApi, getGraphqlInstance } from '../shared/user-login';
import { TOPOLOGICAL_INVENTORY_API_BASE, SOURCES_API_BASE } from '../../utilities/constants';

const sourcesApi = getSourcesApi();
const topologicalApi = getTopologocalInventoryApi();
const axiosInstance = getAxiosInstance();
const graphqlInstance = getGraphqlInstance();

const sourcesQuery = `
query {
  application_types (filter: { name: "/insights/platform/catalog" }) {
    id
    name
    sources {
      id
      name
      source_type_id
    }
  }
}`;

export function getPlatforms() {
  return graphqlInstance.post(`${SOURCES_API_BASE}/graphql`, { query: sourcesQuery })
  .then(({ data: { application_types }}) => application_types)
  .then(([{ sources }]) => sources);
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

export function getPlatformInventories(apiProps, options) {
  let apiPromise = null;

  if (apiProps) {
    apiPromise = axiosInstance.get(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/${apiProps}/service_inventories?filter[archived_at][nil]${options
      ? `&limit=${options.limit}&offset=${options.offset}`
      : ''}`);
  } else {
    apiPromise = topologicalApi.listServiceInventories();
  }

  return apiPromise;
}
