import {
  getAxiosInstance,
  getPortfolioApi,
  getPortfolioItemApi
} from '../shared/user-login';
import {
  CATALOG_API_BASE,
  CATALOG_INVENTORY_API_BASE
} from '../../utilities/constants';
import { sanitizeValues } from '../shared/helpers';
import { defaultSettings } from '../shared/pagination';
import {
  AnyObject,
  ApiCollectionResponse,
  Full,
  InternalPortfolio,
  RestorePortfolioItemConfig
} from '../../types/common-types';
import {
  Portfolio,
  PortfolioItem,
  RestoreKey
} from '@redhat-cloud-services/catalog-client';
import { AxiosPromise, AxiosResponse } from 'axios';
import { Store } from 'redux';
import { Source } from '@redhat-cloud-services/sources-client';
import { GetReduxState } from '../../types/redux';

const axiosInstance = getAxiosInstance();
const portfolioApi = getPortfolioApi();
const portfolioItemApi = getPortfolioItemApi();

export const listPortfolios = (
  filters: AnyObject = {},
  { limit, offset, sortDirection = 'asc' } = defaultSettings
): Promise<ApiCollectionResponse<InternalPortfolio>> => {
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
  return (axiosInstance.get(
    `${CATALOG_API_BASE}/portfolios?limit=${limit}&offset=${offset}${filterQuery}`
  ) as unknown) as Promise<ApiCollectionResponse<InternalPortfolio>>;
};

export const listPortfolioItems = (
  limit = 50,
  offset = 0,
  filter = ''
): Promise<ApiCollectionResponse<PortfolioItem>> => {
  return axiosInstance
    .get(
      `${CATALOG_API_BASE}/portfolio_items?filter[name][contains_i]=${filter}&limit=${limit}&offset=${offset}`
    )
    .then(
      (portfolioItems: ApiCollectionResponse<PortfolioItem & AnyObject>) => {
        const portfolioReference = portfolioItems.data.reduce<AnyObject>(
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
          .get<ApiCollectionResponse<Portfolio>>(
            `${CATALOG_API_BASE}/portfolios?${Object.keys(portfolioReference)
              .map((id) => `filter[id][]=${id}`)
              .join('&')}`
          )
          .then(({ data }) => ({
            portfolioItems,
            portfolioReference,
            portfolios: data
          }));
      }
    )
    .then(({ portfolioItems, portfolioReference, portfolios }) => {
      portfolios.forEach(
        ({ id, name }) =>
          id &&
          portfolioReference[id] &&
          portfolioReference[id].forEach((portfolioItemIndex: number) => {
            portfolioItems.data[portfolioItemIndex].portfolioName = name;
          })
      );
      return portfolioItems;
    });
};

export const getPortfolio = (portfolioId: string): Promise<Portfolio> =>
  portfolioApi.showPortfolio(portfolioId) as Promise<Portfolio>;

export const getPortfolioItemsWithPortfolio = (
  portfolioId: string,
  { limit, offset, filter = '' } = defaultSettings
): Promise<ApiCollectionResponse<PortfolioItem>> =>
  axiosInstance.get(
    `${CATALOG_API_BASE}/portfolios/${portfolioId}/portfolio_items?filter[name][contains_i]=${filter}&limit=${limit}&offset=${offset}`
  );

// TO DO - change to use the API call that adds multiple items to a portfolio when available
export const addPortfolio = async (
  portfolioData: Partial<Portfolio>,
  items?: string[]
): Promise<Portfolio> => {
  const portfolio = await portfolioApi.createPortfolio(portfolioData);
  if (portfolio && items && items.length > 0) {
    await addToPortfolio((portfolio as Portfolio).id!, items);
  }

  return (portfolio as unknown) as Promise<Portfolio>;
};

export const addToPortfolio = (
  portfolioId: string,
  items: string[]
): Promise<PortfolioItem[]> =>
  Promise.all(
    items.map((item) =>
      portfolioItemApi.createPortfolioItem({
        portfolio_id: portfolioId,
        service_offering_ref: item
      })
    )
  ) as Promise<PortfolioItem[]>;

export const updatePortfolio = (
  { id, ...portfolioData }: Partial<Portfolio>,
  store: Partial<Store>
): AxiosPromise<Portfolio> =>
  portfolioApi.updatePortfolio(
    id!,
    sanitizeValues(portfolioData, 'Portfolio', store)
  );

export const removePortfolio = (
  portfolioId: string
): Promise<Full<RestoreKey>> =>
  (portfolioApi.destroyPortfolio(portfolioId) as unknown) as Promise<
    Full<RestoreKey>
  >;

export const removePortfolioItem = (
  portfolioItemId: string
): AxiosPromise<RestoreKey> =>
  portfolioItemApi.destroyPortfolioItem(portfolioItemId);

export const removePortfolioItems = (
  portfolioItemIds: string[]
): Promise<RestorePortfolioItemConfig[]> =>
  Promise.all(
    portfolioItemIds.map(async (itemId) => {
      const { restore_key } = ((await removePortfolioItem(
        itemId
      )) as unknown) as RestorePortfolioItemConfig;
      return {
        portfolioItemId: itemId,
        restoreKey: restore_key
      };
    })
  );

export const fetchProviderControlParameters = (
  portfolioItemId: string
): Promise<AnyObject> =>
  axiosInstance
    .get(
      `${CATALOG_API_BASE}/portfolio_items/${portfolioItemId}/provider_control_parameters`
    )
    .then((data: AnyObject) => ({
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

export const updatePortfolioItem = (
  { id, ...portfolioItem }: Partial<PortfolioItem>,
  store: { getState: GetReduxState }
): Promise<PortfolioItem> =>
  portfolioItemApi.updatePortfolioItem(
    id!,
    sanitizeValues(portfolioItem, 'PortfolioItem', store)
  ) as Promise<PortfolioItem>;

export const fetchPortfolioByName = (
  name = ''
): Promise<ApiCollectionResponse<Portfolio>> =>
  axiosInstance.get(`${CATALOG_API_BASE}/portfolios`, {
    params: {
      filter: {
        name
      }
    }
  });

export const restorePortfolioItems = (
  restoreData: RestorePortfolioItemConfig[]
): Promise<AxiosResponse<PortfolioItem>[]> =>
  Promise.all(
    restoreData.map(({ portfolioItemId, restoreKey }) =>
      portfolioItemApi.unDeletePortfolioItem(portfolioItemId, {
        restore_key: restoreKey
      })
    )
  );

export const copyPortfolio = (portfolioId: string): Promise<Portfolio> =>
  portfolioApi.postCopyPortfolio(portfolioId) as Promise<Portfolio>;

export const copyPortfolioItem = (
  portfolioItemId: string,
  copyObject: Partial<PortfolioItem> = {}
): Promise<PortfolioItem> =>
  portfolioItemApi.postCopyPortfolioItem(
    portfolioItemId,
    copyObject
  ) as Promise<PortfolioItem>;

export const resetPortfolioItemIcon = (iconId: string): AxiosPromise<void> =>
  axiosInstance.delete(`${CATALOG_API_BASE}/icons/${iconId}`);

export const uploadPortfolioItemIcon = (
  portfolioItemId: string,
  file: File,
  iconId?: string
): Promise<void> => {
  const data = new FormData();
  data.append('content', file, file.name);
  if (iconId) {
    return axiosInstance.patch(`${CATALOG_API_BASE}/icons/${iconId}`, data);
  }

  data.append('portfolio_item_id', portfolioItemId);
  return axiosInstance.post(`${CATALOG_API_BASE}/icons`, data, {
    headers: {
      accept: 'application/json',
      'Content-Type': `multipart/form-data; boundary=${
        (data as AnyObject)._boundary
      }`
    }
  });
};

export interface GetPortfolioItemDetailParams {
  portfolioItem: string;
  source: string;
}
export const getPortfolioItemDetail = (
  params: GetPortfolioItemDetailParams
): Promise<[PortfolioItem, Source]> =>
  Promise.all([
    axiosInstance.get(
      `${CATALOG_API_BASE}/portfolio_items/${params.portfolioItem}`
    ),
    axiosInstance
      .get(`${CATALOG_INVENTORY_API_BASE}/sources/${params.source}`)
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

// TODO move to portfolio reducer
interface PortfolioReducerPlaceholder {
  selectedPortfolio?: Portfolio;
  portfolios: ApiCollectionResponse<Portfolio>;
}

export const getPortfolioFromState = (
  portfolioReducer: PortfolioReducerPlaceholder,
  portfolioId: string
): Portfolio | undefined =>
  portfolioReducer.selectedPortfolio &&
  portfolioReducer.selectedPortfolio.id === portfolioId
    ? portfolioReducer.selectedPortfolio
    : portfolioReducer.portfolios.data.find(({ id }) => id === portfolioId);

export const undeletePortfolio = (
  portfolioId: string,
  restoreKey: string
): Promise<Portfolio> =>
  axiosInstance.post(`${CATALOG_API_BASE}/portfolios/${portfolioId}/undelete`, {
    restore_key: restoreKey
  });

export const fetchPortfolioItem = async (
  portfolioItemId: string
): Promise<PortfolioItem> => {
  const portfolioItem = await portfolioItemApi.showPortfolioItem(
    portfolioItemId
  );
  return (portfolioItem as unknown) as PortfolioItem;
};
