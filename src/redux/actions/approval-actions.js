import { ASYNC_ACTIONS } from '../action-types/approval-action-types';
import * as ApprovalHelper from '../../helpers/approval/approval-helper';

export const fetchWorkflows = () => ({
  type: ASYNC_ACTIONS.FETCH_WORKFLOWS,
  payload: ApprovalHelper.getApprovalWorkflows().then(({ data }) => [
    ...data.map(({ id, name }) => ({ value: id, label: name }))
  ])
});

export const linkWorkflow = (id, resourceObject) => ({
  type: ASYNC_ACTIONS.LINK_WORKFLOW,
  payload: ApprovalHelper.linkWorkflow(id, resourceObject),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: 'Success linking workflow',
        description: 'The workflow was linked successfully.'
      }
    }
  }});

export const unlinkWorkflow = (id, name, resourceObject) => ({
  type: ASYNC_ACTIONS.UNLINK_WORKFLOW,
  payload: ApprovalHelper.unlinkWorkflow(id, resourceObject),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: 'Success unlinking workflow',
        description: `The workflow ${name} was unlinked successfully.`
      }
    }
  }});
export const listWorkflowsForObject = (resourceObject) => ({
  type: ASYNC_ACTIONS.RESOLVE_WORKFLOWS,
  payload: listWorkflowsForObject(resourceObject)
});
