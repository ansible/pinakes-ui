/* eslint camelcase: 0 */
import { getAxiosInstance } from '../shared/user-login';
import { AUTH_API_BASE } from '../../utilities/constants';
const axiosInstance = getAxiosInstance();

export const loginUser = (next: string | undefined = undefined) => {
  const nextUrl = next ? `?next=${next}` : '';
  console.log('Debug - loginUser, nextUrl: ', nextUrl);
  window.location.replace(`${AUTH_API_BASE}/login/${nextUrl}`);
  return null;
};

export const getUser = () => {
  return axiosInstance.get(`${AUTH_API_BASE}/me/`);
};

export const logoutUser = () => {
  localStorage.removeItem('catalog_user');
  return axiosInstance.post(`${AUTH_API_BASE}/logout/`);
};
