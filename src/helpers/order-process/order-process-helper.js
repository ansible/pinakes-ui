import { getAxiosInstance, getOrderProcessApi } from '../shared/user-login';
import { CATALOG_API_BASE } from '../../utilities/constants';
const axiosInstance = getAxiosInstance();

export function listOrderProcesses() {
  return axiosInstance.get(`${CATALOG_API_BASE}/order_processes`);
}

export function fetchOrderProcessByName() {
  return axiosInstance.get(`${CATALOG_API_BASE}/order_processes`);
}

export function addOrderProcess(processData) {
  return getOrderProcessApi().createOrderProcess(processData);
}
