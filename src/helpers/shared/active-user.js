/* eslint camelcase: 0 */
import { getAxiosInstance } from '../shared/user-login';
import { CATALOG_API_BASE } from '../../utilities/constants';
const axiosInstance = getAxiosInstance();

export const getUser = () => axiosInstance.get(`${CATALOG_API_BASE}/me/`);
