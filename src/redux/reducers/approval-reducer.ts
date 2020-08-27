import { Workflow } from '@redhat-cloud-services/approval-client';
import { SET_LOADING_STATE } from '../action-types';
import { ASYNC_ACTIONS } from '../action-types/approval-action-types';
import { StateFromReducersMapObject } from 'redux';
import { ReduxAction, AnyObject } from '../../types/common-types';

export interface ApprovalReducerState extends AnyObject {
  isFetching: boolean;
  isResolving: boolean;
  workflows: Workflow[];
  resolvedWorkflows: Workflow[];
}

export type ApprovalReducerActionHandler = (
  state: StateFromReducersMapObject<ApprovalReducerState>,
  action: ReduxAction
) => ApprovalReducerState;

export const approvalInitialState = {
  isFetching: false,
  isResolving: false,
  workflows: [],
  resolvedWorkflows: []
};

const setLoadingState: ApprovalReducerActionHandler = (
  state,
  { payload = true }
) => ({
  ...state,
  isFetching: payload
});
const setWorkflows: ApprovalReducerActionHandler = (state, { payload }) => ({
  ...state,
  isFetching: false,
  workflows: payload
});
const setResolvingState: ApprovalReducerActionHandler = (
  state,
  { payload = true }
) => ({
  ...state,
  isResolving: payload
});
const setResolvedWorkflows: ApprovalReducerActionHandler = (
  state,
  { payload }
) => ({
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
