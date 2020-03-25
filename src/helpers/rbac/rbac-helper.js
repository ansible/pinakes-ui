import { getAxiosInstance, getRbacGroupApi } from '../shared/user-login';
import { RBAC_API_BASE } from '../../utilities/constants';

const api = getRbacGroupApi();

export async function getRbacGroups() {
  return await api.listGroups();
}

export const fetchFilterGroups = (filterValue = '') =>
  getAxiosInstance()
    .get(
      `${RBAC_API_BASE}/groups/${
        filterValue.length > 0 ? `?name=${filterValue}` : ''
      }`
    )
    .then(({ data }) =>
      data.map(({ uuid, name }) => ({ label: name, value: uuid }))
    );
