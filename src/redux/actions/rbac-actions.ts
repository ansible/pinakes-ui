import { FETCH_RBAC_GROUPS } from '../action-types';
import { getRbacGroups } from '../../helpers/rbac/rbac-helper';
import { SelectOptions } from '../../types/common-types';
import { AsyncMiddlewareAction } from '../../types/redux';

export const fetchRbacGroups = (): AsyncMiddlewareAction<SelectOptions> => ({
  type: FETCH_RBAC_GROUPS,
  payload: getRbacGroups().then(({ data }) =>
    data.map(({ uuid, name }) => ({ value: uuid, label: name }))
  )
});
