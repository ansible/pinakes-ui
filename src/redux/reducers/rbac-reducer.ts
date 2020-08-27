import { FETCH_RBAC_GROUPS, SET_LOADING_STATE } from '../action-types';
import { Group } from '@redhat-cloud-services/rbac-client';
import { AnyObject, ReduxActionHandler } from '../../types/common-types';

export interface RbacReducerState extends AnyObject {
  rbacGroups: Group[];
  isLoading: boolean;
}

export type RbacReducerActionHandler = ReduxActionHandler<RbacReducerState>;
export const rbacInitialState: RbacReducerState = {
  rbacGroups: [],
  isLoading: false
};

const setLoadingState: RbacReducerActionHandler = (
  state,
  { payload = true }
) => ({
  ...state,
  isLoading: payload
});
const setRbacGroups: RbacReducerActionHandler = (state, { payload }) => ({
  ...state,
  rbacGroups: payload,
  isLoading: false
});

export default {
  [`${FETCH_RBAC_GROUPS}_PENDING`]: setLoadingState,
  [`${FETCH_RBAC_GROUPS}_FULFILLED`]: setRbacGroups,
  [SET_LOADING_STATE]: setLoadingState
};
