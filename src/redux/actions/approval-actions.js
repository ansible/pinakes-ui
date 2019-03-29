import { ASYNC_ACTIONS } from '../action-types/approval-action-types';
import { getApprovalWorkflows } from '../../helpers/approval/approval-helper';

export const fetchWorkflows = () => ({
  type: ASYNC_ACTIONS.FETCH_WORKFLOWS,
  payload: getApprovalWorkflows().then(({ data }) => [
    ...data.map(({ id, name }) => ({ value: id, label: name }))
  ])
});
