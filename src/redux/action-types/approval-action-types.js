import { createAsyncActionTypes } from './action-types-helper';

const APPROVAL_PREFIX = '@@catalog/approval/';

const asyncActionTypes = [
  'FETCH_WORKFLOWS',
  'UPDATE_WORKFLOWS',
  'RESOLVE_WORKFLOWS'
];

export const ASYNC_ACTIONS = {
  ...createAsyncActionTypes(asyncActionTypes, APPROVAL_PREFIX)
};
