import {
  CheckCircleIcon,
  InfoCircleIcon,
  ErrorCircleOIcon,
  ExclamationCircleIcon
} from '@patternfly/react-icons';
import React from 'react';
import requestsMessages from '../messages/requests.messages';

// eslint-disable no-undef
export const CATALOG_API_BASE =
  // eslint-disable-next-line no-undef
  DEPLOYMENT_MODE === 'standalone'
    ? // eslint-disable-next-line no-undef
      `${API_HOST}${API_BASE_PATH}`
    : `${process.env.BASE_PATH || '/api'}/catalog/v1.3`;
// eslint-disable-next-line no-undef
export const AUTH_API_BASE =
  // eslint-disable-next-line no-undef
  DEPLOYMENT_MODE === 'standalone'
    ? // eslint-disable-next-line no-undef
      `${API_HOST}${AUTH_BASE_PATH}`
    : `${process.env.BASE_PATH || '/api'}/auth`;

export const SOURCES_API_BASE =
  // eslint-disable-next-line no-undef
  DEPLOYMENT_MODE === 'standalone'
    ? // eslint-disable-next-line no-undef
      `${API_HOST}${API_BASE_PATH}`
    : `${process.env.BASE_PATH || '/api'}/sources/v1.0`;
export const APPROVAL_API_BASE =
  // eslint-disable-next-line no-undef
  DEPLOYMENT_MODE === 'standalone'
    ? // eslint-disable-next-line no-undef
      `${API_HOST}${API_BASE_PATH}`
    : `${process.env.BASE_PATH || '/api'}/approval/v1.2`;
export const CATALOG_INVENTORY_API_BASE =
  // eslint-disable-next-line no-undef
  DEPLOYMENT_MODE === 'standalone'
    ? // eslint-disable-next-line no-undef
      `${API_HOST}${API_BASE_PATH}`
    : `${process.env.BASE_PATH || '/api'}/catalog-inventory/v1.0`;
export const RBAC_API_BASE =
  // eslint-disable-next-line no-undef
  DEPLOYMENT_MODE === 'standalone'
    ? // eslint-disable-next-line no-undef
      `${API_HOST}${API_BASE_PATH}`
    : `${process.env.BASE_PATH || '/api'}/rbac/v1`;

export const APPLICATION_TITLE =
  // eslint-disable-next-line no-undef
  `${process.env.APPLICATION_NAME || APPLICATION_NAME || 'Pinakes'}`;

export const permissionValues = ['delete', 'order', 'read', 'update'];

export const permissionOptions = [
  {
    value: 'delete,order,read,update',
    label: 'Can order/edit'
  },
  {
    value: 'order,read',
    label: 'Can order/view'
  }
];

export const PORTFOLIO_RESOURCE_TYPE = 'Portfolio';
export const PORTFOLIO_ITEM_RESOURCE_TYPE = 'PortfolioItem';
export const INVENTORY_RESOURCE_TYPE = 'ServiceInventory';
export const DEFAULT_MAX_LENGTH = 64;

export const APP_NAME = {
  Portfolio: 'catalog',
  PortfolioItem: 'catalog',
  ServiceInventory: 'catalog-inventory'
};

export const BEFORE_TYPE = 'before';
export const AFTER_TYPE = 'after';
export const RETURN_TYPE = 'return';

export const MAX_RETRY_LIMIT = 3;
export const PLATFORMS_DOC_URL =
  // eslint-disable-next-line max-len
  'https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/2.0-ea/html-single/red_hat_ansible_automation_platform_installation_guide/index';

//TODO - replace when standalone user capabilities are available
export const USER_CAPABILITIES_PLACEHOLDER = {
  share: true,
  copy: true,
  unshare: true,
  update: true,
  destroy: true,
  set_approval: true
};
export const CATALOG_ADMIN_ROLE = 'catalog-admin';
export const APPROVAL_ADMIN_ROLE = 'approval-admin';
export const APPROVAL_APPROVER_ROLE = 'approval-approver';

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
  catalog: 'Automation Services Catalog',
  topology: 'Topological inventory'
};

export const APPROVAL_APPR_ROLE = 'approval-approver';
