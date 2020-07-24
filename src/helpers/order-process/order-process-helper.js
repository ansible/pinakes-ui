import { getAxiosInstance } from '../shared/user-login';
import { defaultSettings } from '../shared/pagination';
import { CATALOG_API_BASE } from '../../utilities/constants';
const axiosInstance = getAxiosInstance();

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

