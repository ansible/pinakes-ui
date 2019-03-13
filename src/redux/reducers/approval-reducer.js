import { ASYNC_ACTIONS } from '../ActionTypes/approval-action-types';

export const approvalInitialState = {
  isFetching: false,
  workflows: []
};

const setLoadingState = state => ({ ...state, isFetching: true });
const setWorkflows = (state, { payload }) => ({ ...state, isFetching: false, workflows: payload });

export default {
  [ASYNC_ACTIONS.FETCH_WORKFLOWS_PENDING]: setLoadingState,
  [ASYNC_ACTIONS.FETCH_WORKFLOWS_FULFILLED]: setWorkflows
};
