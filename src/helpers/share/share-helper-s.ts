import { getAxiosInstance, getPortfolioApi } from '../shared/user-login';
import { CATALOG_API_BASE } from '../../utilities/constants';
import {
  ShareInfo,
  SharePolicyPermissionsEnum,
  UnsharePolicyPermissionsEnum
} from '@redhat-cloud-services/catalog-client';

const axiosInstance = getAxiosInstance();
const userApi = getPortfolioApi();

export interface SharePolicy {
  permissions: Array<SharePolicyPermissionsEnum>;
  groups: Array<string>;
}

export interface UnsharePolicy {
  permissions: Array<UnsharePolicyPermissionsEnum>;
  groups?: Array<string>;
}

export const getShareInfo = (portfolioId: string): Promise<ShareInfo> =>
  axiosInstance.get(
    `${CATALOG_API_BASE}/portfolios/${portfolioId}/share_info/`
  );

export interface ShareData<T = SharePolicyPermissionsEnum> {
  permissions: T;
  group_uuid: string;
  id: string;
}
export const sharePortfolio = (data: ShareData): Promise<void> => {
  const policy: SharePolicy = {
    permissions: data.permissions.split(',') as SharePolicyPermissionsEnum[],
    groups: [data.group_uuid]
  };
  return axiosInstance.post(
    `${CATALOG_API_BASE}/portfolios/${data.id}/share/`,
    policy
  );
};

export const unsharePortfolio = (
  data: ShareData<UnsharePolicyPermissionsEnum[]>
): Promise<void> => {
  const policy: UnsharePolicy = {
    permissions: data.permissions,
    groups: [data.group_uuid]
  };
  return axiosInstance.post(
    `${CATALOG_API_BASE}/portfolios/${data.id}/unshare/`,
    policy
  );
};
