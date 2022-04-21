/* eslint camelcase: 0 */
import { getAxiosInstance } from '../shared/user-login';
import { CATALOG_API_BASE } from '../../utilities/constants';
import { ApiCollectionResponse } from '../../types/common-types-s';
import { AxiosInstance, AxiosPromise } from 'axios';
const axiosInstance = getAxiosInstance();

export interface ImportServicePlan {
  /**
   * The Portfolio Item to import the service plans for.
   * @type {string}
   * @memberof ImportServicePlan
   */
  portfolio_item_id?: string;
}

export interface ServicePlan {
  name?: string;
  description?: string;
  schema?: any;
  portfolio_item_id?: string;
  id?: string;
  imported?: boolean;
  modified?: boolean;
}

export interface PatchModifiedServicePlan {
  modified?: any;
}

export const getServicePlans = (
  portfolioItemId: string
): Promise<ApiCollectionResponse<ServicePlan>> =>
  axiosInstance.get(
    `${CATALOG_API_BASE}/portfolio_items/${portfolioItemId}/service_plans/?extra=true`
  ) as Promise<ApiCollectionResponse<ServicePlan>>;

export const patchServicePlanModified = (
  servicePlanId: string,
  patchModifiedServicePlan?: PatchModifiedServicePlan
): Promise<ApiCollectionResponse<ServicePlan>> =>
  axiosInstance.patch(
    `${CATALOG_API_BASE}/service_plans/${servicePlanId}/`,
    patchModifiedServicePlan
  ) as Promise<ApiCollectionResponse<ServicePlan>>;

export const showServicePlanModified = (
  servicePlanId: string
): Promise<ApiCollectionResponse<ServicePlan>> =>
  axiosInstance.get(
    `${CATALOG_API_BASE}/service_plans/${servicePlanId}/?extra=true/`
  );

export const createServicePlan = (
  importServicePlan?: ImportServicePlan,
  options: any = {}
) =>
  axiosInstance.post(`${CATALOG_API_BASE}/service_plans/`, importServicePlan);

export const resetServicePlanModified = (
  id: string,
  options?: any
): AxiosPromise<Array<ServicePlan>> =>
  axiosInstance.post(`${CATALOG_API_BASE}/service_plans/${id}/reset/`);
