import { getAxiosInstance, getPortfolioApi, getPortfolioItemApi } from '../shared/user-login';
import { CATALOG_API_BASE } from '../../utilities/constants';
import { PORTFOLIO_ITEM_NULLABLE, PORTFOLIO_NULLABLE } from '../../constants/nullable-attributes';
import { udefinedToNull } from '../shared/helpers';
import { defaultSettings } from '../shared/pagination';

const axiosInstance = getAxiosInstance();
const portfolioApi = getPortfolioApi();
const portfolioItemApi = getPortfolioItemApi();

export function listPortfolios(filter = '', { limit, offset } = defaultSettings) {
  return axiosInstance.get(`${CATALOG_API_BASE}/portfolios?filter[name][contains_i]=${filter}&limit=${limit}&offset=${offset}`);
}

export function listPortfolioItems(limit = 50, offset = 0, filter = '') {
  return axiosInstance.get(`${CATALOG_API_BASE}/portfolio_items?filter[name][contains_i]=${filter}&limit=${limit}&offset=${offset}`);
}

export function getPortfolioItem(portfolioItemId) {
  return axiosInstance.get(`${CATALOG_API_BASE}/portfolio_items/${portfolioItemId}`);
}

export function getPortfolio(portfolioId) {
  return portfolioApi.showPortfolio(portfolioId);
}

export function getPortfolioItemsWithPortfolio(portfolioId, { limit, offset } = {}) {
  return portfolioApi.fetchPortfolioItemsWithPortfolio(portfolioId, limit, offset);
}

// TO DO - change to use the API call that adds multiple items to a portfolio when available
export async function addPortfolio(portfolioData, items) {
  let portfolio = await portfolioApi.createPortfolio(portfolioData);
  if (!portfolio)
  {return portfolio;}

  if (items && items.length > 0) {
    return addToPortfolio(portfolio, items);
  }
}

export async function addToPortfolio(portfolioId, items) {
  const request = async item => {
    const newItem = await portfolioItemApi.createPortfolioItem({ service_offering_ref: item });
    if (newItem) {
      await portfolioApi.addPortfolioItemToPortfolio(portfolioId, { portfolio_item_id: newItem.id });
    }

    return newItem;
  };

  return Promise.all(items.map(item => request(item)));
}

export async function updatePortfolio(portfolioData) {
  return await portfolioApi.updatePortfolio(portfolioData.id,  udefinedToNull(portfolioData, PORTFOLIO_NULLABLE));
}

export async function removePortfolio(portfolioId) {
  await portfolioApi.destroyPortfolio(portfolioId);
}

export async function removePortfolioItem(portfolioItemId) {
  return portfolioItemApi.destroyPortfolioItem(portfolioItemId);
}

export async function removePortfolioItems(portfolioItemIds) {
  return Promise.all(portfolioItemIds.map(async itemId => {
    const { restore_key } = await removePortfolioItem(itemId);
    return {
      portfolioItemId: itemId,
      restoreKey: restore_key
    };
  }));
}

export function fetchProviderControlParameters(portfolioItemId) {
  return axiosInstance.get(`${CATALOG_API_BASE}/portfolio_items/${portfolioItemId}/provider_control_parameters`)
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

export async function updatePortfolioItem({ id, service_offering_source_ref, portfolio_id, ...portfolioItem }) {
  return await portfolioItemApi.updatePortfolioItem(id, udefinedToNull(portfolioItem, PORTFOLIO_ITEM_NULLABLE));
}

export function fetchPortfolioByName(name = '') {
  return axiosInstance.get(`${CATALOG_API_BASE}/portfolios`, {
    params: {
      filter: {
        name
      }
    }
  });
}

export const restorePortfolioItems = restoreData =>
  Promise.all(restoreData.map(({ portfolioItemId, restoreKey }) =>
    portfolioItemApi.portfolioItemsPortfolioItemIdUndeletePost(portfolioItemId, { restore_key: restoreKey })));

export const copyPortfolio = portfolioId => portfolioApi.postCopyPortfolio(portfolioId);

export const copyPortfolioItem = (portfolioItemId, copyObject = {}) => portfolioItemApi.postCopyPortfolioItem(portfolioItemId, copyObject);

export const uploadPortfolioItemIcon = (portfolioItemId, file) => {
  let data = new FormData();
  data.append('content', file, file.name);
  data.append('portfolio_item_id', portfolioItemId);
  return axiosInstance.post(`${CATALOG_API_BASE}/icons`, data, {
    headers: {
      accept: 'application/json',
      'Content-Type': `multipart/form-data; boundary=${data._boundary}`
    }
  });
};
