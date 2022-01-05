import { getAxiosInstance, getRbacGroupApi } from '../shared/user-login';
import { RBAC_API_BASE } from '../../utilities/constants';
import { SelectOptions } from '../../types/common-types';

export interface GroupOut {
  name: string;
  description?: string;
  id: string;
  created: string;
  modified: string;
  principalCount?: number;
  roleCount?: number;
  system?: boolean;
  platform_default?: boolean;
}

export interface GroupPagination {
  results: Array<GroupOut>;
}

export const getRbacGroups = (): Promise<GroupPagination> =>
  getAxiosInstance().get(`${RBAC_API_BASE}/groups/`) as Promise<
    GroupPagination
  >;

export const fetchFilterGroups = (filterValue = ''): Promise<SelectOptions> =>
  getAxiosInstance()
    .get(
      `${RBAC_API_BASE}/groups/${
        filterValue.length > 0 ? `?name=${filterValue}` : ''
      }`
    )
    .then(({ results }: GroupPagination) => {
      return results.map(({ id, name }) => ({ label: name, value: id }));
    });
