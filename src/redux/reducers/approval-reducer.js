import { SET_LOADING_STATE } from '../action-types';
import { ASYNC_ACTIONS } from '../action-types/approval-action-types';

export const approvalInitialState = {
  isFetching: false,
  workflows: []
};

const setLoadingState = (state, { payload = true }) => ({ ...state, isFetching: payload });
const setWorkflows = (state, { payload }) => ({ ...state, isFetching: false, workflows: payload });

export default {
  [ASYNC_ACTIONS.FETCH_WORKFLOWS_PENDING]: setLoadingState,
  [ASYNC_ACTIONS.FETCH_WORKFLOWS_FULFILLED]: setWorkflows,
  [SET_LOADING_STATE]: setLoadingState
};
