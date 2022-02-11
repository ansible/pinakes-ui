/* eslint camelcase: 0 */
import { getAxiosInstance } from '../shared/user-login';
import { AUTH_API_BASE } from '../../utilities/constants';
const axiosInstance = getAxiosInstance();

export const getUser = () => axiosInstance.get(`${AUTH_API_BASE}/me/`);

export const logoutUser = () => {
  localStorage.removeItem('catalog_user');
  return axiosInstance.post(`${AUTH_API_BASE}/logout/`);
};

export const loginUser = () => {
  window.location.replace(`${AUTH_API_BASE}/login/`);
  return null;
};
