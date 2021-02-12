import { getAxiosInstance, getGraphqlInstance } from '../shared/user-login';
import {
  CATALOG_INVENTORY_API_BASE,
  SOURCES_API_BASE
} from '../../utilities/constants';
import { defaultSettings, PaginationConfiguration } from '../shared/pagination';
import {
  Source,
  ServiceOffering,
  ServiceInventory
} from '@redhat-cloud-services/sources-client';
import { ApiCollectionResponse, SourceDetails } from '../../types/common-types';
const axiosInstance = getAxiosInstance();
const { post } = getGraphqlInstance();

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

const getSourcesDetails = (
  sourceIds: string[]
): Promise<ApiCollectionResponse<SourceDetails>> => {
  return axiosInstance.get(
    `${CATALOG_INVENTORY_API_BASE}/sources?limit=${sourceIds.length ||
      defaultSettings.limit}${sourceIds.length ? '&' : ''}${sourceIds
      .map((sourceId) => `filter[id][]=${sourceId}`)
      .join('&')}`
  );
};

export const getPlatforms = (): Promise<SourceDetails> =>
  post(`${SOURCES_API_BASE}/graphql`, { query: sourcesQuery })
    .then(({ data: { application_types } }) => application_types)
    .then(([{ sources }]) => {
      return getSourcesDetails(sources.map((source: Source) => source.id)).then(
        (sourceDetails) => {
          return sources.map((source: Source) => ({
            ...source,
            ...sourceDetails.data.find(
              (sourceDetail) => sourceDetail.id === source.id
            )
          }));
        }
      );
    });

export const getPlatform = (platformId: string): Promise<Source> => {
  return axiosInstance.get(
    `${CATALOG_INVENTORY_API_BASE}/sources/${platformId}`
  );
};

export const getPlatformItems = (
  platformId: string,
  filter?: string,
  options?: PaginationConfiguration
): Promise<ApiCollectionResponse<ServiceOffering>> => {
  const filterQuery = filter ? `&filter[name][contains_i]=${filter}` : '';
  if (platformId) {
    return axiosInstance.get(
      `${CATALOG_INVENTORY_API_BASE}/sources/${platformId}/service_offerings?filter[archived_at][nil]${filterQuery}${
        options ? `&limit=${options.limit}&offset=${options.offset}` : ''
      }`
    );
  } else {
    return axiosInstance.get(`${CATALOG_INVENTORY_API_BASE}/service_offerings`);
  }
};

export const getPlatformInventories = (
  platformId: string,
  filter = '',
  options = defaultSettings
): Promise<ApiCollectionResponse<ServiceInventory>> => {
  if (platformId) {
    return axiosInstance.get(
      `${CATALOG_INVENTORY_API_BASE}/sources/${platformId}/service_inventories?filter[name][contains_i]=${filter}${
        options ? `&limit=${options.limit}&offset=${options.offset}` : ''
      }`
    );
  } else {
    return axiosInstance.get(
      `${CATALOG_INVENTORY_API_BASE}/service_inventories?limit=${options.limit}&offset=${options.offset}`
    );
  }
};

export const getServiceOffering = (
  serviceOfferingId: string,
  sourceId: string
): Promise<{ service: ServiceOffering; source: Source }> =>
  Promise.all([
    axiosInstance.get(
      `${CATALOG_INVENTORY_API_BASE}/service_offerings/${serviceOfferingId}`
    ),
    axiosInstance
      .get(`${SOURCES_API_BASE}/sources/${sourceId}`)
      .then((source) => {
        return axiosInstance
          .get(`${SOURCES_API_BASE}/source_types/${source.source_type_id}`)
          .then(({ icon_url }) => ({
            ...source,
            icon_url
          }));
      })
  ]).then(([service, source]: [ServiceOffering, Source]) => ({
    service,
    source
  }));
