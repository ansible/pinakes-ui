import React, { Fragment } from 'react';
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

export const updateWorkflows = (toUnlinkIds, toLinkIds, resourceObject) => (
  dispatch
) =>
  dispatch({
    type: ASYNC_ACTIONS.UPDATE_WORKFLOWS,
    payload: ApprovalHelper.updateWorkflows(
      toUnlinkIds,
      toLinkIds,
      resourceObject
    ).then(() =>
      dispatch(
        addNotification({
          variant: 'success',
          title: 'Success updating workflows',
          dismissable: true,
          description: (
            <Fragment>
              {toUnlinkIds.length > 0 ? (
                <FormattedMessage
                  id="workflows.update_workflows"
                  defaultMessage={`{count, number} {count, plural, one {workflow was}
                    other {workflows were}} unlinked succesfully. `}
                  values={{ count: toUnlinkIds.length }}
                />
              ) : (
                ''
              )}
              {toLinkIds.length > 0 ? (
                <FormattedMessage
                  id="workflows.update_workflows"
                  defaultMessage={`{count, number} {count, plural, one {workflow was}
                    other {workflows were}} linked succesfully.`}
                  values={{ count: toLinkIds.length }}
                />
              ) : (
                ''
              )}
            </Fragment>
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
