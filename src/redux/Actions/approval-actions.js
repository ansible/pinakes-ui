import { ASYNC_ACTIONS } from '../ActionTypes/approval-action-types';
import { getApprovalWorkflow } from '../../Helpers/approval/approval-helper';

export const fetchWorkflows = () => ({
  type: ASYNC_ACTIONS.FETCH_WORKFLOWS,
  payload: getApprovalWorkflow().then(({ data }) => [
    ...data.map(({ id, name }) => ({ value: id, label: name }))
  ])
});
