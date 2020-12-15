import { getAxiosInstance, getOrderProcessApi } from '../shared/user-login';
import { defaultSettings } from '../shared/pagination';
import { CATALOG_API_BASE } from '../../utilities/constants';
import {
  OrderProcess,
  ResourceObject
} from '@redhat-cloud-services/catalog-client';
import {
  ApiCollectionResponse,
  ApiMetadata,
  SelectOptions,
  SortBy
} from '../../types/common-types';
import { AxiosResponse } from 'axios';
const axiosInstance = getAxiosInstance();
const orderProcessApi = getOrderProcessApi();

const sortPropertiesMapper = (property: string): string => property;

export const listOrderProcesses = (
  filter = '',
  sortBy?: SortBy,
  { limit, offset }: ApiMetadata = defaultSettings
): Promise<ApiCollectionResponse<OrderProcess>> => {
  const sortQuery = sortBy
    ? `&sort_by=${sortPropertiesMapper(sortBy.property)}:${sortBy.direction}`
    : '';
  return axiosInstance.get(
    `${CATALOG_API_BASE}/order_processes?filter[name][contains_i]=${filter}&limit=${limit}&offset=${offset}${sortQuery}`
  );
};

export const loadProductOptions = (
  filterValue = ''
): Promise<SelectOptions> => {
  return getAxiosInstance()
    .get(
      `${CATALOG_API_BASE}/portfolio_items?filter[name][contains]=${filterValue}`
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

export const fetchOrderProcess = (id: string): Promise<OrderProcess> =>
  (getOrderProcessApi().showOrderProcess(id) as unknown) as Promise<
    OrderProcess
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
): Promise<ApiCollectionResponse<OrderProcess>> =>
  axiosInstance.get(
    `${CATALOG_API_BASE}/order_processes?app_name=catalog&object_type=${objectType}&object_id=${objectId}`
  );

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

export const updateOrderProcess = async (
  id: string,
  {
    before_portfolio_item_id,
    after_portfolio_item_id,
    ...data
  }: Partial<OrderProcess>
): Promise<OrderProcess> => {
  const op = await getOrderProcessApi().updateOrderProcess(id, {
    name: data.name,
    description: data.description,
    before_portfolio_item_id: before_portfolio_item_id || '',
    after_portfolio_item_id: after_portfolio_item_id || ''
  });

  return op as OrderProcess;
};

export const addOrderProcess = async ({
  before_portfolio_item_id,
  after_portfolio_item_id,
  ...data
}: Partial<OrderProcess>): Promise<[
  OrderProcess,
  OrderProcess | undefined
]> => {
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
  return Promise.all([promiseA, promiseB]);
};
