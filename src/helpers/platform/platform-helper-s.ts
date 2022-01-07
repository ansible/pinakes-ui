import { getAxiosInstance } from '../shared/user-login';
import {
  CATALOG_API_BASE,
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
    const filterQuery = filter ? `name=${filter}` : '';
    return axiosInstance.get(
      `${CATALOG_API_BASE}/sources/${platformId}/service_inventories/?${filterQuery}${
        options ? `&page_size=${options.limit}&page=${options.offset || 1}` : ''
      }`
    );
  } else {
    return axiosInstance.get(
      `${CATALOG_API_BASE}/service_inventories/?page_size=${
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
      `${CATALOG_INVENTORY_API_BASE}/service_offerings/${serviceOfferingId}/`
    ),
    axiosInstance.get(`${SOURCES_API_BASE}/sources/${sourceId}`)
  ]).then(([service, source]: [ServiceOffering, Source]) => ({
    service,
    source
  }));
