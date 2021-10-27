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
  /**
   * The name of the service plan.
   * @type {string}
   * @memberof ServicePlan
   */
  name?: string;
  /**
   * The service plan description.
   * @type {string}
   * @memberof ServicePlan
   */
  description?: string;
  /**
   * JSON schema for the object.
   * @type {object}
   * @memberof ServicePlan
   */
  create_json_schema?: object;
  /**
   * The reference ID of the Portfolio Item
   * @type {string}
   * @memberof ServicePlan
   */
  portfolio_item_id?: string;
  /**
   * The unique identifier for this service plan.
   * @type {string}
   * @memberof ServicePlan
   */
  id?: string;
  /**
   * Whether or not the ServicePlan has been imported for editing
   * @type {boolean}
   * @memberof ServicePlan
   */
  imported?: boolean;
  /**
   * Whether or not the ServicePlan has a modified schema
   * @type {boolean}
   * @memberof ServicePlan
   */
  modified?: boolean;
}

export interface PatchModifiedServicePlan {
  /**
   * the new modified schema for the service plan
   * @type {object}
   * @memberof PatchModifiedServicePlan
   */
  modified?: any;
}

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
) =>
  axiosInstance.post(`${CATALOG_API_BASE}/service_plans/`, importServicePlan);

export const resetServicePlanModified = (
  id: string,
  options?: any
): AxiosPromise<Array<ServicePlan>> =>
  axiosInstance.post(`${CATALOG_API_BASE}$/service_plans/${id}/reset/`);
