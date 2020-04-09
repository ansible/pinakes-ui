import { getAxiosInstance, getPortfolioApi } from '../shared/user-login';
import { CATALOG_API_BASE } from '../../utilities/constants';

const axiosInstance = getAxiosInstance();
const userApi = getPortfolioApi();

export async function getShareInfo(portfolioId) {
  return await axiosInstance.get(
    `${CATALOG_API_BASE}/portfolios/${portfolioId}/share_info`
  );
}

export function sharePortfolio(data) {
  let policy = {
    permissions: data.permissions.split(','),
    group_uuids: [data.group_uuid]
  };
  return userApi.sharePortfolio(data.id, policy);
}

export function unsharePortfolio(data) {
  let policy = {
    permissions: data.permissions,
    group_uuids: [data.group_uuid]
  };
  return userApi.unsharePortfolio(data.id, policy);
}
