import { SET_LOADING_STATE } from '../action-types';
import { ASYNC_ACTIONS } from '../action-types/approval-action-types';

export const approvalInitialState = {
  isFetching: false,
  isResolving: false,
  workflows: [],
  resolvedWorkflows: []
};

const setLoadingState = (state, { payload = true }) => ({
  ...state,
  isFetching: payload
});
const setWorkflows = (state, { payload }) => ({
  ...state,
  isFetching: false,
  workflows: payload
});
const setResolvingState = (state, { payload = true }) => ({
  ...state,
  isResolving: payload
});
const setResolvedWorkflows = (state, { payload }) => ({
  ...state,
  isResolving: false,
  resolvedWorkflows: payload
});

export default {
  [ASYNC_ACTIONS.FETCH_WORKFLOWS_PENDING]: setLoadingState,
  [ASYNC_ACTIONS.FETCH_WORKFLOWS_FULFILLED]: setWorkflows,
  [ASYNC_ACTIONS.RESOLVE_WORKFLOWS_PENDING]: setResolvingState,
  [ASYNC_ACTIONS.RESOLVE_WORKFLOWS_FULFILLED]: setResolvedWorkflows,
  [SET_LOADING_STATE]: setLoadingState
};
