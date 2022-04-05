import { FETCH_GROUPS } from '../action-types';

// Initial State
export const groupsInitialState = {
  groups: [],
  isLoading: false
};

const setLoadingState = (state) => ({ ...state, isLoading: true });
const setGroups = (state, { payload }) => ({
  ...state,
  groups: payload,
  isLoading: false
});

export default {
  [`${FETCH_GROUPS}_PENDING`]: setLoadingState,
  [`${FETCH_GROUPS}_FULFILLED`]: setGroups
};
