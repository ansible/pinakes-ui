import { getAxiosInstance, getOrderProcessApi } from '../shared/user-login';
import { defaultSettings } from '../shared/pagination';
import { CATALOG_API_BASE } from '../../utilities/constants';
const axiosInstance = getAxiosInstance();

export function listOrderProcesses(
    filter= {},
    { limit, offset, sortBy='name' ,sortDirection = 'asc' } = defaultSettings
) {
  const filterQuery = `&filter[name][contains_i]=${filter}`;
  const sortQuery = sortBy ? `&sort_by=${sortBy}:${sortDirection}` : '';
  const paginationQuery = `&limit=${limit}&offset=${offset}`;
  return axiosInstance.get(`${CATALOG_API_BASE}/order_processes` );
}

export function fetchOrderProcessByName(name = '') {
  return axiosInstance.get(`${CATALOG_API_BASE}/order_processes`)}
export function addOrderProcess(processData) {
  return getOrderProcessApi().createOrderProcess(processData);
}