import {
  getAxiosInstance,
  getPortfolioApi,
  getPortfolioItemApi
} from '../shared/user-login';
import { CATALOG_API_BASE } from '../../utilities/constants';
import { sanitizeValues } from '../shared/helpers';
import { defaultSettings } from '../shared/pagination';
import {
  AnyObject,
  ApiCollectionResponse,
  Full,
  InternalPortfolio,
  RestorePortfolioItemConfig
} from '../../types/common-types-s';
import { Portfolio, RestoreKey } from '@redhat-cloud-services/catalog-client';
import { AxiosPromise, AxiosResponse } from 'axios';
import { Store } from 'redux';
import { Source } from '@redhat-cloud-services/sources-client';
import { GetReduxState } from '../../types/redux';
import { PortfolioReducerState } from '../../redux/reducers/portfolio-reducer';

export interface PortfolioItem {
  owner: string;
  service_offering_type: string;
  metadata: any;
  description: string | null;
  created_at: string;
  long_description: string | null;
  orphan: boolean;
  documentation_url: string | null;
  icon_id: string;
  distributor: string | null;
  support_url: string | null;
  updated_at: string;
  service_offering_source_ref: string;
  portfolio: string;
  name: string;
  portfolio_id: string;
  id: string;
  state: string;
  favorite: boolean;
}

const axiosInstance = getAxiosInstance();

export const listPortfolios = (
  filters: AnyObject = {},
  { offset, limit, sortDirection = 'asc' } = defaultSettings
): Promise<ApiCollectionResponse<InternalPortfolio>> => {
  const filterQuery = Object.entries(filters).reduce((acc, [key, value]) => {
    if (!value) {
      return acc;
    }

    const partial =
      key === 'sort_by'
        ? `sort_by=${value}:${sortDirection}`
        : `search=${value}`;
    return `${acc}&${partial}`;
  }, '');

  return (axiosInstance.get(
    `${CATALOG_API_BASE}/portfolios/?page=${offset ||
      1}&page_size=${limit}&${filterQuery}`
  ) as unknown) as Promise<ApiCollectionResponse<InternalPortfolio>>;
};

export const listPortfolioItems = (
  limit = 50,
  offset = 0,
  filter = ''
): Promise<ApiCollectionResponse<PortfolioItem>> => {
  return axiosInstance
    .get(
      `${CATALOG_API_BASE}/portfolio_items/?search=${filter}&page=${offset ||
        1}&page_size=${limit}`
    )
    .then(
      (portfolioItems: ApiCollectionResponse<PortfolioItem & AnyObject>) => {
        const portfolioReference = portfolioItems.results.reduce<AnyObject>(
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
            `${CATALOG_API_BASE}/portfolios/?${Object.keys(portfolioReference)
              .map((id) => `id=${id}`)
              .join('&')}`
          )
          .then(({ results }) => ({
            portfolioItems,
            portfolioReference,
            portfolios: results
          }));
      }
    )
    .then(({ portfolioItems, portfolioReference, portfolios }) => {
      portfolios.forEach(
        ({ id, name }) =>
          id &&
          portfolioReference[id] &&
          portfolioReference[id].forEach((portfolioItemIndex: number) => {
            portfolioItems.results[portfolioItemIndex].portfolioName = name;
          })
      );
      return portfolioItems;
    });
};

export const getPortfolio = (portfolioId: string): Promise<Portfolio> =>
  axiosInstance.get(`${CATALOG_API_BASE}/portfolios/${portfolioId}/`);

export const getPortfolioItemsWithPortfolio = (
  portfolioId: string,
  { limit, offset, filter = '' } = defaultSettings
): Promise<ApiCollectionResponse<PortfolioItem>> =>
  axiosInstance.get(
    `${CATALOG_API_BASE}/portfolios/${portfolioId}/portfolio_items/?search=${filter}&page_size=${limit}&page=${offset ||
      1}`
  );

export const addToPortfolio = (
  portfolioId: string,
  items: PortfolioItem[]
): Promise<PortfolioItem[]> => {
  return Promise.all(
    items.map((item) => {
      return axiosInstance.post(`${CATALOG_API_BASE}/portfolio_items/`, {
        name: item?.name,
        description: item?.description,
        portfolio: portfolioId,
        service_offering_ref: item.id
      });
    })
  ) as Promise<PortfolioItem[]>;
};

// TO DO - change to use the API call that adds multiple items to a portfolio when available
export const addPortfolio = async (
  portfolioData: Partial<Portfolio>,
  items?: PortfolioItem[]
): Promise<Portfolio> => {
  const portfolio = await axiosInstance.post(
    `${CATALOG_API_BASE}/portfolios/`,
    portfolioData
  );
  if (portfolio && items && items.length > 0) {
    await addToPortfolio((portfolio as Portfolio).id!, items);
  }

  return (portfolio as unknown) as Promise<Portfolio>;
};

export const updatePortfolio = (
  { id, ...portfolioData }: Partial<Portfolio>,
  store: Partial<Store>
): AxiosPromise<Portfolio> =>
  axiosInstance.patch(`${CATALOG_API_BASE}/portfolios/${id}/`, portfolioData);

export const removePortfolio = (
  portfolioId: string
): Promise<Full<RestoreKey>> =>
  axiosInstance.delete(`${CATALOG_API_BASE}/portfolios/${portfolioId}/`);

export const removePortfolioItem = (
  portfolioItemId: string
): AxiosPromise<RestoreKey> =>
  axiosInstance.delete(
    `${CATALOG_API_BASE}/portfolio_items/${portfolioItemId}/`
  );

export const removePortfolioItems = (
  portfolioItemIds: string[]
): Promise<RestorePortfolioItemConfig[]> =>
  Promise.all(
    portfolioItemIds.map(async (itemId) => {
      ((await removePortfolioItem(
        itemId
      )) as unknown) as RestorePortfolioItemConfig;
      return {
        portfolioItemId: itemId
      };
    })
  );

export const fetchProviderControlParameters = (
  portfolioItemId: string
): Promise<AnyObject> =>
  axiosInstance
    .get(
      `${CATALOG_API_BASE}/portfolio_items/${portfolioItemId}/provider_control_parameters/`
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
  axiosInstance.patch(
    `${CATALOG_API_BASE}/portfolio_items/${id}/`,
    sanitizeValues(portfolioItem, 'PortfolioItem', store)
  );

export const fetchPortfolioByName = (
  name = ''
): Promise<ApiCollectionResponse<Portfolio>> =>
  axiosInstance.get(`${CATALOG_API_BASE}/portfolios/?name=${name}`);

export const restorePortfolioItems = (
  restoreData: RestorePortfolioItemConfig[]
): Promise<AxiosResponse<PortfolioItem>[]> =>
  Promise.all(
    restoreData.map(({ portfolioItemId, restoreKey }) =>
      axiosInstance.post(
        `${CATALOG_API_BASE}/portfolio-items/${portfolioItemId}/restore/`,
        {
          restore_key: restoreKey
        }
      )
    )
  );

export const copyPortfolio = (portfolioId: string): Promise<Portfolio> =>
  axiosInstance.post(`${CATALOG_API_BASE}/portfolios/${portfolioId}/copy/`);

export const copyPortfolioItem = (
  portfolioItemId: string,
  copyObject: Partial<PortfolioItem> = {}
): Promise<PortfolioItem> => {
  return axiosInstance.post(
    `${CATALOG_API_BASE}/portfolio_items/${portfolioItemId}/copy/`,
    copyObject
  );
};

export const resetPortfolioItemIcon = (
  portfolioItemId: string
): AxiosPromise<void> => {
  return axiosInstance.delete(
    `${CATALOG_API_BASE}/portfolio_items/${portfolioItemId}/icon/`
  );
};

export const uploadPortfolioItemIcon = (portfolioItemData: {
  file: any;
  icon_url: string;
  portfolioItemId: string;
}): Promise<void> | undefined => {
  const data = new FormData();
  data.append('file', portfolioItemData.file);
  data.append('name', portfolioItemData.file.name);
  data.append('source_ref', '1');
  if (portfolioItemData) {
    if (portfolioItemData?.icon_url && portfolioItemData.icon_url.length > 0) {
      return axiosInstance.patch(
        `${CATALOG_API_BASE}/portfolio_items/${portfolioItemData.portfolioItemId}/icon/`,
        data,
        {
          headers: {
            accept: 'application/json',
            'Content-Type': `multipart/form-data; boundary=${
              (data as AnyObject)._boundary
            }`
          }
        }
      );
    } else {
      return axiosInstance.post(
        `${CATALOG_API_BASE}/portfolio_items/${portfolioItemData.portfolioItemId}/icon/`,
        data,
        {
          headers: {
            accept: 'application/json',
            'Content-Type': `multipart/form-data; boundary=${
              (data as AnyObject)._boundary
            }`
          }
        }
      );
    }
  } else {
    return undefined;
  }
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
      `${CATALOG_API_BASE}/portfolio_items/${params.portfolioItem}/`
    ),
    axiosInstance
      .get(`${CATALOG_API_BASE}/sources/${params.source}/`)
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
  selectedPortfolio?: InternalPortfolio;
  portfolios: ApiCollectionResponse<InternalPortfolio>;
}

export const getPortfolioFromState = (
  portfolioReducer: PortfolioReducerState,
  portfolioId: string
): InternalPortfolio | undefined =>
  portfolioReducer.selectedPortfolio &&
  portfolioReducer.selectedPortfolio.id &&
  portfolioReducer.selectedPortfolio.id.toString() === portfolioId
    ? portfolioReducer.selectedPortfolio
    : portfolioReducer.portfolios?.results?.find(
        (portfolio) => portfolio?.id && portfolio.id.toString() === portfolioId
      );

export const undeletePortfolio = (
  portfolioId: string,
  restoreKey: string
): Promise<Portfolio> =>
  axiosInstance.post(
    `${CATALOG_API_BASE}/portfolios/${portfolioId}/undelete/`,
    {
      restore_key: restoreKey
    }
  );
