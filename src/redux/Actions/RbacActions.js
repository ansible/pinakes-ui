import * as ActionTypes from '../ActionTypes';
import * as RbacHelper from '../../Helpers/Rbac/RbacHelper';

const doFetchGroups = () => ({
  type: ActionTypes.FETCH_GROUPS,
  payload: RbacHelper.getGroups().then(({ data }) => data)
});

export const fetchGroups = () => (dispatch) => dispatch(doFetchGroups());

export const fetchSelectedGroup = name => ({
  type: ActionTypes.FETCH_GROUP,
  payload: RbacHelper.getGroup(name)
});
