import {
  FETCH_RBAC_GROUPS
} from '../ActionTypes';

// Initial State
export const rbacInitialState = {
  rbacGroups: [],
  isLoading: true
};

const setRbacGroups = (state, { payload }) => ({ ...state, rbacGroups: payload, isLoading: false });

export default {
  [`${FETCH_RBAC_GROUPS}_FULFILLED`]: setRbacGroups
};
