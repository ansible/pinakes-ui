import {
  CheckCircleIcon,
  InfoCircleIcon,
  ErrorCircleOIcon,
  ExclamationCircleIcon
} from '@patternfly/react-icons';
import React from 'react';
import requestsMessages from '../messages/requests.messages';
export const MIN_SCREEN_HEIGHT = 'calc(100vh - 76px)';

export const APPROVAL_API_BASE =
  // eslint-disable-next-line no-undef
  `${API_HOST}${API_BASE_PATH}`;

export const AUTH_API_BASE =
  // eslint-disable-next-line no-undef
  `${API_HOST}${AUTH_BASE_PATH}`;

export const decisionValues = {
  undecided: {
    displayName: requestsMessages.needsReview,
    color: 'blue',
    icon: <InfoCircleIcon />
  },
  approved: {
    displayName: requestsMessages.approved,
    color: 'green',
    icon: <CheckCircleIcon />
  },
  denied: {
    displayName: requestsMessages.denied,
    color: 'red',
    icon: <ExclamationCircleIcon />
  },
  canceled: {
    displayName: requestsMessages.canceled,
    color: 'red',
    icon: <ErrorCircleOIcon />
  },
  error: {
    displayName: requestsMessages.error,
    color: 'red',
    icon: <ExclamationCircleIcon />
  }
};

// React intl does not support empty strings
export const untranslatedMessage = (defaultMessage = ' ') => ({
  id: 'untranslated',
  defaultMessage
});
export const APP_DISPLAY_NAME = {
  catalog: 'Pinakes',
  topology: 'Topological inventory'
};

export const APPROVAL_ADMIN_ROLE = 'approval-admin';
export const APPROVAL_APPR_ROLE = 'approval-approver';
