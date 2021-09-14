import { getAxiosInstance, getGraphqlInstance } from '../shared/user-login';
import {
  CATALOG_API_BASE,
  CATALOG_INVENTORY_API_BASE
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
    `${CATALOG_API_BASE}/sources?page_size=${sourceIds.length ||
      defaultSettings.limit}${sourceIds.length ? '&' : ''}${sourceIds
      .map((sourceId) => `id=${sourceId}/`)
      .join('&')}`
  );
};

export const getPlatforms = (): Promise<SourceDetails> =>
  axiosInstance.get(`${CATALOG_API_BASE}/sources/`);

export const getPlatform = (platformId: string): Promise<Source> => {
  return axiosInstance.get(`${CATALOG_API_BASE}/sources/${platformId}/`);
};

export const refreshPlatform = (platformId: string): Promise<Source> => {
  return axiosInstance.patch(
    `${CATALOG_API_BASE}/sources/${platformId}/refresh/`
  );
};

export const getPlatformItems = (
  platformId: string,
  filter?: string,
  options?: PaginationConfiguration
): Promise<ApiCollectionResponse<ServiceOffering>> => {
  if (platformId) {
    const filterQuery = filter ? `?name=${filter}` : '';
    const optionsQuery = options
      ? `page_size=${options.limit}&page=${options.offset || 1}`
      : '';
    return axiosInstance.get(
      `${CATALOG_API_BASE}/sources/${platformId}/service_offerings/${filterQuery}${
        filter ? '&' : '?'
      }${optionsQuery}`
    );
  } else {
    return axiosInstance.get(`${CATALOG_API_BASE}/service_offerings/`);
  }
};

export const getPlatformInventories = (
  platformId: string,
  filter = '',
  options = defaultSettings
): Promise<ApiCollectionResponse<ServiceInventory>> => {
  if (platformId) {
    return axiosInstance.get(
      `${CATALOG_API_BASE}/sources/${platformId}/service_inventories?name=${filter}${
        options ? `&page-size=${options.limit}&page=${options.offset}` : ''
      }`
    );
  } else {
    return axiosInstance.get(
      `${CATALOG_API_BASE}/service_inventories?page_size=${
        options.limit
      }&page=${options.offset || 1}`
    );
  }
};

export const getServiceOffering = (
  serviceOfferingId: string,
  sourceId: string
): Promise<{ service: ServiceOffering; source: Source }> =>
  Promise.all([
    axiosInstance.get(
      `${CATALOG_API_BASE}/service_offerings/${serviceOfferingId}/`
    ),
    axiosInstance
      .get(`${CATALOG_API_BASE}/sources/${sourceId}`)
      .then((source) => {
        return axiosInstance
          .get(`${CATALOG_API_BASE}/source_types/${source.source_type_id}`)
          .then(({ icon_url }) => ({
            ...source,
            icon_url
          }));
      })
  ]).then(([service, source]: [ServiceOffering, Source]) => ({
    service,
    source
  }));
