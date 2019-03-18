import { FETCH_RBAC_GROUPS } from '../ActionTypes';
import { getRbacGroups } from '../../Helpers/rbac/rbac-helper';

export const fetchRbacGroups = () => ({
  type: FETCH_RBAC_GROUPS,
  payload: getRbacGroups().then(({ data }) => [
    ...data.map(({ uuid, name }) => ({ value: uuid, label: name }))
  ])
});


export async function queryPortfolio(portfolioData) {
  // TODO - link API call
}

export async function sharePortfolio(portfolioData) {
  // TODO - link API call
}

export async function unsharePortfolio(portfolioData) {
  // TODO - link API call
}