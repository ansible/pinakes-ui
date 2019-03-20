import { getUserApi } from '../shared/user-login';
import { CATALOG_API_BASE } from '../../utilities/constants';

const userApi = getUserApi();

export function listPortfolios() {
  return userApi.listPortfolios();
}

export function getPortfolioItems() {
  return listPortfolioItems();
}

export function listPortfolioItems() {
  return userApi.listPortfolioItems();
}

export function getPortfolioItem(portfolioItemId) {
  return fetch(`${CATALOG_API_BASE}/portfolio_items/${portfolioItemId}`).then(data => data.json());
}

export function getPortfolio(portfolioId) {
  return userApi.showPortfolio(portfolioId);
}

export function getPortfolioItemsWithPortfolio(portfolioId) {
  return fetch(`${CATALOG_API_BASE}/portfolios/${portfolioId}/portfolio_items`).then(data => data.json());
}

// TO DO - change to use the API call that adds multiple items to a portfolio when available
export async function addPortfolio(portfolioData, items) {
  let portfolio = await userApi.createPortfolio(portfolioData);
  if (!portfolio)
  {return portfolio;}

  if (items && items.length > 0) {
    return addToPortfolio(portfolio, items);
  }
}

export async function addToPortfolio(portfolioId, items) {
  const request = async item => {
    const newItem = await userApi.createPortfolioItem({ service_offering_ref: item });
    if (newItem) {
      await userApi.addPortfolioItemToPortfolio(portfolioId, { portfolio_item_id: newItem.id });
    }

    return newItem;
  };

  return Promise.all(items.map(item => request(item)));
}

export async function updatePortfolio(portfolioData) {
  await userApi.updatePortfolio(portfolioData.id, portfolioData);
}

export async function removePortfolio(portfolioId) {
  await userApi.destroyPortfolio(portfolioId);
}

export async function removePortfolioItem(portfolioItemId) {
  return userApi.destroyPortfolioItem(portfolioItemId);
}

export async function removePortfolioItems(portfolioItemIds) {
  return Promise.all(portfolioItemIds.map(async itemId => await removePortfolioItem(itemId)));
}

export function fetchProviderControlParameters(portfolioItemId) {
  return fetch(`${CATALOG_API_BASE}/portfolio_items/${portfolioItemId}/provider_control_parameters`)
  .then(data => data.json())
  .then(data => ({
    required: [],
    ...data,
    properties: {
      ...data.properties,
      namespace: {
        ...data.properties.namespace,
        enum: Array.from(new Set([ ...data.properties.namespace.enum ]))
      }
    }}));
}

export async function updatePortfolioItem(portfolioItem) {
  return await fetch(`${CATALOG_API_BASE}/portfolio_items/${portfolioItem.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...portfolioItem,
      workflow_ref: portfolioItem.workflow_ref || null
    })
  });
}

export function queryPortfolio(portfolioId) {
  return userApi.queryPortfolio(portfolioId);
}

export async function sharePortfolio(portfolioData) {
  let policy = new CatalogApi.SharePolicy(portfolioData.permissions.split(','), [portfolioData.group]);
  await userApi.sharePortfolio(portfolioData.id, policy);
}

export async function unsharePortfolio(portfolioData) {
  await userApi.unsharePortfolio(portfolioData.id, portfolioData);
}
