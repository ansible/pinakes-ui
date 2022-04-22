import { FETCH_GROUPS } from '../action-types';
import * as GroupHelper from '../../helpers/group/group-helper';

export const fetchRbacApprovalGroups = () => ({
  type: FETCH_GROUPS,
  payload: GroupHelper.fetchFilterApprovalGroups()
});
