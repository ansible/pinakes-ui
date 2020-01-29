import React from 'react';
import { FormattedMessage } from 'react-intl';
import { ASYNC_ACTIONS } from '../action-types/approval-action-types';
import * as ApprovalHelper from '../../helpers/approval/approval-helper';
import { defaultSettings } from '../../helpers/shared/pagination';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/index';

export const fetchWorkflows = () => ({
  type: ASYNC_ACTIONS.FETCH_WORKFLOWS,
  payload: ApprovalHelper.getApprovalWorkflows().then(({ data }) => [
    ...data.map(({ id, name }) => ({ value: id, label: name }))
  ])
});

export const linkWorkflows = (workflowIds, resourceObject) => (dispatch) =>
  dispatch({
    type: ASYNC_ACTIONS.LINK_WORKFLOW,
    payload: ApprovalHelper.linkWorkflows(workflowIds, resourceObject).then(
      () =>
        dispatch(
          addNotification({
            variant: 'success',
            title: 'Success linking workflows',
            description: (
              <FormattedMessage
                id="workflows.link_workflows"
                defaultMessage={`{count, number} {count, plural, one {workflow was}
                  other {workflows were}} linked succesfully.`}
                values={{ count: workflowIds.length }}
              />
            )
          })
        )
    )
  });

export const unlinkWorkflows = (workflowIds, resourceObject) => (dispatch) =>
  dispatch({
    type: ASYNC_ACTIONS.LINK_WORKFLOW,
    payload: ApprovalHelper.unlinkWorkflows(workflowIds, resourceObject).then(
      () =>
        dispatch(
          addNotification({
            variant: 'success',
            title: 'Success unlinking workflows',
            description: (
              <FormattedMessage
                id="workflows.unlink_workflows"
                defaultMessage={`{count, number} {count, plural, one {workflow was}
                  other {workflows were}} unlinked succesfully.`}
                values={{ count: workflowIds.length }}
              />
            )
          })
        )
    )
  });

export const listWorkflowsForObject = (
  resourceObject,
  meta = { limit: defaultSettings.limit, offset: defaultSettings.offset },
  filter = ''
) => ({
  type: ASYNC_ACTIONS.RESOLVE_WORKFLOWS,
  payload: ApprovalHelper.listWorkflowsForObject(resourceObject, meta, filter)
});
