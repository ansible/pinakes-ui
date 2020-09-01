import {
  getAxiosInstance,
  getPortfolioApi,
  getPortfolioItemApi
} from '../shared/user-login';
import { CATALOG_API_BASE, SOURCES_API_BASE } from '../../utilities/constants';
import { sanitizeValues } from '../shared/helpers';
import { defaultSettings } from '../shared/pagination';

const axiosInstance = getAxiosInstance();
const portfolioApi = getPortfolioApi();
const portfolioItemApi = getPortfolioItemApi();

export function listPortfolios(
  filters = {},
  { limit, offset, sortDirection = 'asc' } = defaultSettings
) {
  const filterQuery = Object.entries(filters).reduce((acc, [key, value]) => {
    if (!value) {
      return acc;
    }

    const partial =
      key === 'sort_by'
        ? `sort_by=${value}:${sortDirection}`
        : `filter[${key}][contains_i]=${value}`;
    return `${acc}&${partial}`;
  }, '');
  return axiosInstance.get(
    `${CATALOG_API_BASE}/portfolios?limit=${limit}&offset=${offset}${filterQuery}`
  );
}

export function listPortfolioItems(limit = 50, offset = 0, filter = '') {
  return axiosInstance
    .get(
      `${CATALOG_API_BASE}/portfolio_items?filter[name][contains_i]=${filter}&limit=${limit}&offset=${offset}`
    )
    .then((portfolioItems) => {
      const portfolioReference = portfolioItems.data.reduce(
        (acc, curr, index) =>
          curr.portfolio_id
            ? {
                ...acc,
                [curr.portfolio_id]: acc[curr.portfolio_id]
                  ? [...acc[curr.portfolio_id], index]
                  : [index]
              }
            : acc,
        {}
      );
      return axiosInstance
        .get(
          `${CATALOG_API_BASE}/portfolios?${Object.keys(portfolioReference)
            .map((id) => `filter[id][]=${id}`)
            .join('&')}`
        )
        .then(({ data }) => ({
          portfolioItems,
          portfolioReference,
          portfolios: data
        }));
    })
    .then(({ portfolioItems, portfolioReference, portfolios }) => {
      portfolios.forEach(
        ({ id, name }) =>
          portfolioReference[id] &&
          portfolioReference[id].forEach((portfolioItemIndex) => {
            portfolioItems.data[portfolioItemIndex].portfolioName = name;
          })
      );
      return portfolioItems;
    });
}

export function getPortfolio(portfolioId) {
  return portfolioApi.showPortfolio(portfolioId);
}

export function getPortfolioItemsWithPortfolio(
  portfolioId,
  { limit, offset, filter = '' } = defaultSettings
) {
  return axiosInstance.get(
    `${CATALOG_API_BASE}/portfolios/${portfolioId}/portfolio_items?filter[name][contains_i]=${filter}&limit=${limit}&offset=${offset}`
  );
}

// TO DO - change to use the API call that adds multiple items to a portfolio when available
export async function addPortfolio(portfolioData, items) {
  let portfolio = await portfolioApi.createPortfolio(portfolioData);
  if (portfolio && items && items.length > 0) {
    return addToPortfolio(portfolio, items);
  }

  return portfolio;
}

export async function addToPortfolio(portfolioId, items) {
  return Promise.all(
    items.map((item) =>
      portfolioItemApi.createPortfolioItem({
        portfolio_id: portfolioId,
        service_offering_ref: item
      })
    )
  );
}

export async function updatePortfolio({ id, ...portfolioData }, store) {
  return await portfolioApi.updatePortfolio(
    id,
    sanitizeValues(portfolioData, 'Portfolio', store)
  );
}

export async function removePortfolio(portfolioId) {
  return portfolioApi.destroyPortfolio(portfolioId);
}

export async function removePortfolioItem(portfolioItemId) {
  return portfolioItemApi.destroyPortfolioItem(portfolioItemId);
}

export async function removePortfolioItems(portfolioItemIds) {
  return Promise.all(
    portfolioItemIds.map(async (itemId) => {
      const { restore_key } = await removePortfolioItem(itemId);
      return {
        portfolioItemId: itemId,
        restoreKey: restore_key
      };
    })
  );
}

export function fetchProviderControlParameters(portfolioItemId) {
  return axiosInstance
    .get(
      `${CATALOG_API_BASE}/portfolio_items/${portfolioItemId}/provider_control_parameters`
    )
    .then((data) => ({
      required: [],
      ...data,
      properties: {
        ...data.properties,
        namespace: {
          ...data.properties.namespace,
          enum: Array.from(new Set([...data.properties.namespace.enum]))
        }
      }
    }));
}

export async function updatePortfolioItem({ id, ...portfolioItem }, store) {
  return await portfolioItemApi.updatePortfolioItem(
    id,
    sanitizeValues(portfolioItem, 'PortfolioItem', store)
  );
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

export const restorePortfolioItems = (restoreData) =>
  Promise.all(
    restoreData.map(({ portfolioItemId, restoreKey }) =>
      portfolioItemApi.unDeletePortfolioItem(portfolioItemId, {
        restore_key: restoreKey
      })
    )
  );

export const copyPortfolio = (portfolioId) =>
  portfolioApi.postCopyPortfolio(portfolioId);

export const copyPortfolioItem = (portfolioItemId, copyObject = {}) =>
  portfolioItemApi.postCopyPortfolioItem(portfolioItemId, copyObject);

export const uploadPortfolioItemIcon = (portfolioItemId, file, iconId) => {
  let data = new FormData();
  data.append('content', file, file.name);
  if (iconId) {
    return axiosInstance.patch(`${CATALOG_API_BASE}/icons/${iconId}`, data);
  }

  data.append('portfolio_item_id', portfolioItemId);
  return axiosInstance.post(`${CATALOG_API_BASE}/icons`, data, {
    headers: {
      accept: 'application/json',
      'Content-Type': `multipart/form-data; boundary=${data._boundary}`
    }
  });
};

export const getPortfolioItemDetail = (params) =>
  Promise.all([
    axiosInstance.get(
      `${CATALOG_API_BASE}/portfolio_items/${params.portfolioItem}`
    ),
    axiosInstance
      .get(`${SOURCES_API_BASE}/sources/${params.source}`)
      .catch((error) => {
        if (error.status === 404) {
          return {
            object: 'platform',
            notFound: true
          };
        }

        throw error;
      })
  ]);

export const getPortfolioFromState = (portfolioReducer, portfolioId) =>
  portfolioReducer.selectedPortfolio &&
  portfolioReducer.selectedPortfolio.id === portfolioId
    ? portfolioReducer.selectedPortfolio
    : portfolioReducer.portfolios.data.find(({ id }) => id === portfolioId);

export const undeletePortfolio = (portfolioId, restoreKey) =>
  axiosInstance.post(`${CATALOG_API_BASE}/portfolios/${portfolioId}/undelete`, {
    restore_key: restoreKey
  });
