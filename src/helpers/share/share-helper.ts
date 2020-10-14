import { getAxiosInstance, getPortfolioApi } from '../shared/user-login';
import { CATALOG_API_BASE } from '../../utilities/constants';
import {
  ShareInfo,
  SharePolicy,
  SharePolicyPermissionsEnum,
  UnsharePolicyPermissionsEnum,
  UnsharePolicy
} from '@redhat-cloud-services/catalog-client';

const axiosInstance = getAxiosInstance();
const userApi = getPortfolioApi();

export const getShareInfo = (portfolioId: string): Promise<ShareInfo> =>
  axiosInstance.get(`${CATALOG_API_BASE}/portfolios/${portfolioId}/share_info`);

export interface ShareData<T = SharePolicyPermissionsEnum> {
  permissions: T;
  group_uuid: string;
  id: string;
}
export const sharePortfolio = (data: ShareData): Promise<void> => {
  const policy: SharePolicy = {
    permissions: data.permissions.split(',') as SharePolicyPermissionsEnum[],
    group_uuids: [data.group_uuid]
  };
  return (userApi.sharePortfolio(data.id, policy) as unknown) as Promise<void>;
};

export const unsharePortfolio = (
  data: ShareData<UnsharePolicyPermissionsEnum[]>
): Promise<void> => {
  const policy: UnsharePolicy = {
    permissions: data.permissions,
    group_uuids: [data.group_uuid]
  };
  return (userApi.unsharePortfolio(data.id, policy) as unknown) as Promise<
    void
  >;
};
