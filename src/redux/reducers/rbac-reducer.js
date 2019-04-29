import {
  FETCH_RBAC_GROUPS,
  SET_LOADING_STATE
} from '../action-types';

// Initial State
export const rbacInitialState = {
  rbacGroups: [],
  isLoading: false
};

const setLoadingState = (state, { payload = true }) => ({ ...state, isLoading: payload });
const setRbacGroups = (state, { payload }) => ({ ...state, rbacGroups: payload, isLoading: false });

export default {
  [`${FETCH_RBAC_GROUPS}_PENDING`]: setLoadingState,
  [`${FETCH_RBAC_GROUPS}_FULFILLED`]: setRbacGroups,
  [SET_LOADING_STATE]: setLoadingState
};
