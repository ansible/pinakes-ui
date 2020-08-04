import { ASYNC_ACTIONS } from '../action-types/approval-action-types';
import * as ApprovalHelper from '../../helpers/approval/approval-helper';
import { defaultSettings } from '../../helpers/shared/pagination';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/cjs/actions';
import extractFormatMessage from '../../utilities/extract-format-message';
import approvalMessages from '../../messages/approval.messages';

export const fetchWorkflows = () => ({
  type: ASYNC_ACTIONS.FETCH_WORKFLOWS,
  payload: ApprovalHelper.getApprovalWorkflows().then(({ data }) => [
    ...data.map(({ id, name }) => ({ value: id, label: name }))
  ])
});

export const updateWorkflows = (toLinkIds, toUnlinkIds, resourceObject) => (
  dispatch,
  getState
) => {
  const formatMessage = extractFormatMessage(getState);
  return dispatch({
    type: ASYNC_ACTIONS.UPDATE_WORKFLOWS,
    payload: ApprovalHelper.updateWorkflows(
      toUnlinkIds,
      toLinkIds,
      resourceObject
    ).then(() =>
      dispatch(
        addNotification({
          variant: 'success',
          title: 'Success updating approval process',
          dismissable: true,
          description: `${
            toUnlinkIds.length > 0
              ? formatMessage(approvalMessages.unlinkNotification, {
                  count: toUnlinkIds.length
                })
              : ''
          }
          ${
            toLinkIds.length > 0
              ? formatMessage(approvalMessages.linkNotification, {
                  count: toLinkIds.length
                })
              : ''
          }`
        })
      )
    )
  });
};

export const listWorkflowsForObject = (
  resourceObject,
  meta = { limit: defaultSettings.limit, offset: defaultSettings.offset },
  filter = ''
) => ({
  type: ASYNC_ACTIONS.RESOLVE_WORKFLOWS,
  payload: ApprovalHelper.listWorkflowsForObject(resourceObject, meta, filter)
});
