import { Dispatch } from 'redux';
import {
  ApiCollectionResponse,
  ApiMetadata,
  InternalResourceObject
} from '../../types/common-types';
import { ASYNC_ACTIONS } from '../action-types/approval-action-types';
import * as ApprovalHelper from '../../helpers/approval/approval-helper';
import { defaultSettings } from '../../helpers/shared/pagination';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/actions';
import extractFormatMessage from '../../utilities/extract-format-message';
import approvalMessages from '../../messages/approval.messages';
import { AsyncMiddlewareAction, GetReduxState } from '../../types/redux';
import {
  ResourceObject,
  Workflow
} from '@redhat-cloud-services/approval-client';

export const fetchWorkflows = (): AsyncMiddlewareAction<{
  value?: string;
  label?: string;
}[]> => ({
  type: ASYNC_ACTIONS.FETCH_WORKFLOWS,
  payload: ApprovalHelper.getApprovalWorkflows().then(({ data }) =>
    data.map(({ id, name }) => ({ value: id, label: name }))
  )
});

export const updateWorkflows = (
  toLinkIds: string[],
  toUnlinkIds: string[],
  resourceObject: ResourceObject
) => (dispatch: Dispatch, getState: GetReduxState): AsyncMiddlewareAction => {
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
              ? formatMessage &&
                formatMessage(approvalMessages.unlinkNotification, {
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
  resourceObject: InternalResourceObject,
  meta: ApiMetadata = {
    limit: defaultSettings.limit,
    offset: defaultSettings.offset
  },
  filter = ''
): AsyncMiddlewareAction<ApiCollectionResponse<Workflow>> => ({
  type: ASYNC_ACTIONS.RESOLVE_WORKFLOWS,
  payload: ApprovalHelper.listWorkflowsForObject(resourceObject, meta, filter)
});
