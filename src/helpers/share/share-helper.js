import { getUserApi } from '../shared/user-login';
import { CATALOG_API_BASE } from '../../utilities/constants';

const userApi = getUserApi();

export async function getShareInfo(portfolioId) {
  //return userApi.shareInfo(portfolioId);
  return await fetch(`${CATALOG_API_BASE}/portfolios/${portfolioId}/share_info`).then(data => data.json());
}

export async function sharePortfolio(data) {
  let policy = { permissions: data.permissions.split(','), group_uuids: [ data.group ]};
  await userApi.sharePortfolio(data.id, policy);
}

export async function unsharePortfolio(data) {
  let policy = { permissions: data.permissions, group_uuids: [ data.group_uuid ]};
  await userApi.unsharePortfolio(data.portfolioId, policy);
}
