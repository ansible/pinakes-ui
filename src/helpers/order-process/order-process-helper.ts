import { getAxiosInstance, getOrderProcessApi } from '../shared/user-login';
import { defaultSettings } from '../shared/pagination';
import { CATALOG_API_BASE } from '../../utilities/constants';
import {
  OrderProcess,
  ResourceObject
} from '@redhat-cloud-services/catalog-client';
import { ApiCollectionResponse, ApiMetadata } from '../../types/common-types';
import { AxiosResponse } from 'axios';
const axiosInstance = getAxiosInstance();
const orderProcessApi = getOrderProcessApi();

export const listOrderProcesses = (
  filter = '',
  { limit, offset }: ApiMetadata = defaultSettings
): Promise<ApiCollectionResponse<OrderProcess>> =>
  axiosInstance.get(
    `${CATALOG_API_BASE}/order_processes?filter[name][contains_i]=${filter}&limit=${limit}&offset=${offset}`
  );

export const loadProductOptions = (
  filterValue = '',
  initialLookup: string[] = []
) => {
  const initialLookupQuery = initialLookup
    .map((product) => `filter[id][]=${product}`)
    .join('&');

  return getAxiosInstance()
    .get(
      `${CATALOG_API_BASE}/portfolio_items?filter[name][contains]=${filterValue}&${initialLookupQuery ||
        ''}`
    )
    .then(({ data }) =>
      data.map((item: { name: string; id: string }) => ({
        label: item.name,
        value: item.id
      }))
    );
};

export const fetchOrderProcessByName = (
  name: string
): Promise<ApiCollectionResponse<OrderProcess>> => listOrderProcesses(name);

export const fetchOrderProcess = (
  id: string
): Promise<ApiCollectionResponse<OrderProcess>> =>
  (getOrderProcessApi().showOrderProcess(id) as unknown) as Promise<
    ApiCollectionResponse<OrderProcess>
  >;

export const setOrderProcesses = (
  toTag: string[],
  toUntag: string[],
  resourceType: ResourceObject
): Promise<AxiosResponse<void>[]> => {
  const promises = [
    ...toTag.map((id) =>
      orderProcessApi.linkTagToOrderProcess(id, resourceType)
    ),
    ...toUntag.map((id) =>
      orderProcessApi.unlinkTagFromOrderProcess(id, resourceType)
    )
  ];
  return Promise.all(promises);
};

export const getLinkedOrderProcesses = (
  objectType: string,
  objectId: string
): Promise<OrderProcess> =>
  axiosInstance.get(
    `${CATALOG_API_BASE}/order_processes?app_name=catalog&object_type=${objectType}&object_id=${objectId}`
  );

export const addBeforePortfolioItem = (
  id: string,
  item: string
): Promise<OrderProcess> =>
  getOrderProcessApi().addOrderProcessBeforeItem(id, {
    portfolio_item_id: item
  }) as Promise<OrderProcess>;

export const addAfterPortfolioItem = (
  id: string,
  item: string
): Promise<OrderProcess> =>
  getOrderProcessApi().addOrderProcessAfterItem(id, {
    portfolio_item_id: item
  }) as Promise<OrderProcess>;

export const removeOrderProcess = (processId: string): Promise<void> =>
  (getOrderProcessApi().destroyOrderProcess(processId) as unknown) as Promise<
    void
  >;

export const removeOrderProcesses = (
  selectedProcesses: string[]
): Promise<AxiosResponse<void>[]> =>
  Promise.all(
    selectedProcesses.map(
      async (processId) =>
        await getOrderProcessApi().destroyOrderProcess(processId)
    )
  );

export const updateOrderProcess = (
  id: string,
  data: Partial<OrderProcess>
): Promise<OrderProcess> =>
  getOrderProcessApi().updateOrderProcess(id, data) as Promise<OrderProcess>;

export const listBeforeProductsForProcess = (
  id: string
): Promise<OrderProcess> =>
  getOrderProcessApi().listOrderProcessTags(id) as Promise<OrderProcess>;

export const addOrderProcess = async ({
  before_portfolio_item_id,
  after_portfolio_item_id,
  ...data
}: Partial<OrderProcess>): Promise<OrderProcess> => {
  const op = await getOrderProcessApi().createOrderProcess({
    name: data.name,
    description: data.description
  });

  const promiseB =
    before_portfolio_item_id !== undefined
      ? getOrderProcessApi().addOrderProcessBeforeItem(
          ((op as unknown) as OrderProcess).id as string,
          { portfolio_item_id: before_portfolio_item_id }
        )
      : {};
  const promiseA =
    after_portfolio_item_id !== undefined
      ? getOrderProcessApi().addOrderProcessAfterItem(
          ((op as unknown) as OrderProcess).id as string,
          { portfolio_item_id: after_portfolio_item_id }
        )
      : {};
  return Promise.all([promiseA, promiseB]) as Promise<OrderProcess>;
};
