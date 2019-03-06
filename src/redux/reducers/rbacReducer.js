import {
  FETCH_GROUP,
  FETCH_GROUPS,
  FILTER_GROUPS
} from '../../redux/ActionTypes';

// Initial State
export const rbacInitialState = {
  isRbacDataLoading: false,
  groups: [],
  group: {},
  filterValue: ''
};

const setLoadingState = state => ({ ...state, isRbacDataLoading: true });
const setGroups = (state, { payload }) => ({ ...state, groups: payload, isRbacDataLoading: false });
const selectGroup = (state, { payload }) => ({ ...state, selectedGroup: payload, isLoading: false });
const filterGroups = (state, { payload }) => ({ ...state, filterValue: payload });

export default {
  [`${FETCH_GROUPS}_PENDING`]: setLoadingState,
  [`${FETCH_GROUPS}_FULFILLED`]: setGroups,
  [`${FETCH_GROUP}_PENDING`]: setLoadingState,
  [`${FETCH_GROUP}_FULFILLED`]: selectGroup,
  [`${FILTER_GROUPS}_FULFILLED`]: filterGroups
};
