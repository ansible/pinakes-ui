import { getAxiosInstance, getSourcesApi, getTopologocalInventoryApi, getGraphqlInstance } from '../shared/user-login';
import { TOPOLOGICAL_INVENTORY_API_BASE, SOURCES_API_BASE } from '../../utilities/constants';
import { defaultSettings } from '../shared/pagination';

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

export const getPlatforms = () => {
  return graphqlInstance.post(`${SOURCES_API_BASE}/graphql`, { query: sourcesQuery })
  .then(({ data: { application_types }}) => application_types)
  .then(([{ sources }]) => sources);
};

export const getPlatform = (platformId) => {
  return sourcesApi.showSource(platformId);
};

export const getPlatformItems = (apiProps, filter = '', options) => {
  let apiPromise = null;

  if (apiProps) {
    apiPromise = axiosInstance.
    get(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/${apiProps}/service_offerings?filter[archived_at][nil]
    &filter[name][contains_i]${filter}${options ? `&limit=${options.limit}&offset=${options.offset}` : ''}`);
  } else {
    apiPromise = topologicalApi.listServiceOfferings();
  }

  return apiPromise;
};

export const getPlatformInventories = (platformId, filter = '', options = defaultSettings) => {
  if (platformId) {
    return axiosInstance.
    get(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/${platformId}/service_inventories?filter[name][contains_i]=${filter}${options
      ? `&limit=${options.limit}&offset=${options.offset}`
      : ''}`);
  } else {
    return topologicalApi.listServiceInventories(options);
  }
};
