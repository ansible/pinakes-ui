/* eslint camelcase: 0 */
import { getAxiosInstance } from '../shared/user-login';
import { CATALOG_API_BASE } from '../../utilities/constants';
import { ServicePlan } from '@redhat-cloud-services/catalog-client';
import { ApiCollectionResponse } from '../../types/common-types-s';
import {
  ImportServicePlan,
  PatchModifiedServicePlan
} from '@redhat-cloud-services/catalog-client/api';
import { AxiosInstance, AxiosPromise } from 'axios';
import { RequestArgs } from '@redhat-cloud-services/catalog-client/base';
const axiosInstance = getAxiosInstance();

export const getServicePlans = (
  portfolioItemId: string
): Promise<ApiCollectionResponse<ServicePlan>> =>
  axiosInstance.get(
    `${CATALOG_API_BASE}${portfolioItemId}/service_plans/`
  ) as Promise<ApiCollectionResponse<ServicePlan>>;

export const patchServicePlanModified = (
  servicePlanId: string,
  patchModifiedServicePlan?: PatchModifiedServicePlan
): Promise<ApiCollectionResponse<ServicePlan>> =>
  axiosInstance.patch(
    `${CATALOG_API_BASE}/service_plans/${servicePlanId}/modified/`,
    patchModifiedServicePlan
  ) as Promise<ApiCollectionResponse<ServicePlan>>;

export const showServicePlanModified = (
  servicePlanId: string
): Promise<ApiCollectionResponse<ServicePlan>> =>
  axiosInstance.get(
    `${CATALOG_API_BASE}/service_plans/${servicePlanId}/modified/`
  );

export const createServicePlan = (
  importServicePlan?: ImportServicePlan,
  options: any = {}
): Promise<RequestArgs> =>
  axiosInstance.post(`${CATALOG_API_BASE}/service_plans/`, importServicePlan);

export const resetServicePlanModified = (
  id: string,
  options?: any
): AxiosPromise<Array<ServicePlan>> =>
  axiosInstance.post(`${CATALOG_API_BASE}$/service_plans/${id}/reset/`);
