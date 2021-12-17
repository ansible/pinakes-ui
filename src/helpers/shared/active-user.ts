/* eslint camelcase: 0 */
import { getAxiosInstance } from '../shared/user-login';
import {
  CATALOG_API_BASE,
  EXTERNAL_LOGIN_URI
} from '../../utilities/constants';
const axiosInstance = getAxiosInstance();

export const getUser = () => axiosInstance.get(`${CATALOG_API_BASE}/me/`);

export const logoutUser = () => {
  localStorage.removeItem('catalog_user');
  return axiosInstance.post(`${CATALOG_API_BASE}/logout/`);
};

export const loginUser = () => {
  window.location.replace(EXTERNAL_LOGIN_URI);
  return null;
};
