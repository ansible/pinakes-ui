import { getAxiosInstance, getRbacGroupApi } from '../shared/user-login';
import { RBAC_API_BASE } from '../../utilities/constants';
import { GroupPagination } from '@redhat-cloud-services/rbac-client';
import { AxiosPromise } from 'axios';
import { SelectOptions } from '../../types/common-types';

const api = getRbacGroupApi();

export const getRbacGroups = (): AxiosPromise<GroupPagination> =>
  api.listGroups();

export const fetchFilterGroups = (filterValue = ''): Promise<SelectOptions> =>
  getAxiosInstance()
    .get(
      `${RBAC_API_BASE}/groups/${
        filterValue.length > 0 ? `?name=${filterValue}` : ''
      }`
    )
    .then(({ data }: GroupPagination) =>
      data.map(({ uuid, name }) => ({ label: name, value: uuid }))
    );
