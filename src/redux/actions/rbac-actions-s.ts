import { FETCH_RBAC_GROUPS } from '../action-types';
import { getRbacGroups } from '../../helpers/rbac/rbac-helper-s';
import { SelectOptions } from '../../types/common-types';
import { AsyncMiddlewareAction } from '../../types/redux';

export const fetchRbacGroups = (): AsyncMiddlewareAction<SelectOptions> => ({
  type: FETCH_RBAC_GROUPS,
  payload: getRbacGroups().then(({ results }) =>
    results.map(({ id, name }) => ({ value: id, label: name }))
  )
});
