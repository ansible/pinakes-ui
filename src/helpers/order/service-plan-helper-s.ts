/* eslint camelcase: 0 */
import { getAxiosInstance } from '../shared/user-login';
import { CATALOG_API_BASE } from '../../utilities/constants';
import { ServicePlan } from '@redhat-cloud-services/catalog-client';
import { ApiCollectionResponse } from '../../types/common-types-s';
const axiosInstance = getAxiosInstance();

export const getServicePlans = (
  portfolioItemId: string
): Promise<ApiCollectionResponse<ServicePlan>> =>
  axiosInstance.get(
    `${CATALOG_API_BASE}${portfolioItemId}/service_plans/`
  ) as Promise<ApiCollectionResponse<ServicePlan>>;
