import * as ActionTypes from '../action-types';
import * as RequestHelper from '../../helpers/request/request-helper';
import { defaultSettings } from '../../helpers/shared/pagination';
import actionModalMessages from '../../messages/action-modal.messages';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const fetchRequests = (persona, pagination) => (dispatch, getState) => {
  const { sortBy, requests, filterValue } = getState().requestReducer;

  let finalPagination = pagination || defaultSettings;

  if (!pagination && requests) {
    const { limit, offset } = requests.meta;
    finalPagination = { limit, offset };
  }

  return dispatch({
    type: ActionTypes.APPROVAL_FETCH_REQUESTS,
    payload: RequestHelper.fetchRequests(
      filterValue,
      finalPagination,
      persona,
      sortBy
    )
  });
};

export const fetchRequest = (apiProps, persona) => ({
  type: ActionTypes.FETCH_REQUEST,
  payload: RequestHelper.fetchRequestWithSubrequests(apiProps, persona)
});

export const fetchRequestContent = (apiProps, persona) => ({
  type: ActionTypes.FETCH_REQUEST_CONTENT,
  payload: RequestHelper.fetchRequestContent(apiProps, persona)
});

export const createRequestAction = (actionName, requestId, actionIn, intl) => ({
  type: ActionTypes.CREATE_REQUEST_ACTION,
  payload: RequestHelper.createRequestAction(requestId, actionIn),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: intl.formatMessage(actionModalMessages.successTitle),
        description: intl.formatMessage(actionModalMessages.fulfilledAction, {
          actionName
        })
      },
      rejected: {
        variant: 'danger',
        title: intl.formatMessage(actionModalMessages.failedTitle, {
          actionName
        }),
        description: intl.formatMessage(actionModalMessages.failedAction, {
          actionName
        })
      }
    }
  }
});
