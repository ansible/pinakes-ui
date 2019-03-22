import { getUserApi } from '../Shared/userLogin';
import { CATALOG_API_BASE } from '../../Utilities/Constants';
import * as CatalogApi from 'catalog_api' //'@manageiq/service-portal-api';

const userApi = getUserApi();

export function getShareInfo(portfolioId) {
  //return userApi.shareInfo(portfolioId);
  return fetch(`${CATALOG_API_BASE}/portfolios/${portfolioId}/share_info`).then(data => data.json());
}

export async function sharePortfolio(portfolioData) {
  let policy = new CatalogApi.SharePolicy(portfolioData.permissions.split(','), [portfolioData.group]);
  await userApi.sharePortfolio(portfolioData.id, policy);
}

export async function unsharePortfolio(portfolioData) {
  await userApi.unsharePortfolio(portfolioData.id, portfolioData);
}
