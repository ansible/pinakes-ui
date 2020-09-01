import { getAxiosInstance, getOrderProcessApi } from '../shared/user-login';
import { defaultSettings } from '../shared/pagination';
import { CATALOG_API_BASE } from '../../utilities/constants';
const axiosInstance = getAxiosInstance();
const orderProcessApi = getOrderProcessApi();

export function listOrderProcesses(
  filter = '',
  { limit, offset } = defaultSettings
) {
  return axiosInstance.get(
    `${CATALOG_API_BASE}/order_processes?filter[name][contains_i]=${filter}&limit=${limit}&offset=${offset}`
  );
}

export function fetchOrderProcessByName(name) {
  return listOrderProcesses(name);
}

export function addOrderProcess(processData) {
  return getOrderProcessApi().createOrderProcess(processData);
}

export const setOrderProcesses = (toTag, toUntag, resourceType) => {
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

export const getLinkedOrderProcesses = (objectType, objectId) =>
  axiosInstance.get(
    `${CATALOG_API_BASE}/order_processes?app_name=catalog&object_type=${objectType}&object_id=${objectId}`
  );
