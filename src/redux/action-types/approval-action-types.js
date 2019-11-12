import { createAsyncActionTypes } from './action-types-helper';

const APPROVAL_PREFIX = '@@catalog/approval/';

const asyncActionTypes = [ 'FETCH_WORKFLOWS', 'LINK_WORKFLOW', 'UNLINK_WORKFLOW', 'RESOLVE_WORKFLOW' ];

export const ASYNC_ACTIONS = {
  ...createAsyncActionTypes(asyncActionTypes, APPROVAL_PREFIX)
};

