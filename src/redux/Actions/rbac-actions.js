import { FETCH_RBAC_GROUPS } from '../ActionTypes';
import { getRbacGroups } from '../../Helpers/rbac/rbac-helper';

export const fetchRbacGroups = () => ({
  type: FETCH_RBAC_GROUPS,
  payload: getRbacGroups().then(({ data }) => [
    ...data.map(({ uuid, name }) => ({ value: uuid, label: name }))
  ])
});

