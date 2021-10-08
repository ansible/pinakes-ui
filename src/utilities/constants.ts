// eslint-disable-next-line no-undef
export const CATALOG_API_BASE =
  // eslint-disable-next-line no-undef
  window.catalog?.standalone
    ? 'http://127.0.0.1:8000/api/v1'
    : `${process.env.BASE_PATH || '/api'}/catalog/v1.3`;
export const SOURCES_API_BASE =
  // eslint-disable-next-line no-undef
  window.catalog?.standalone
    ? 'http://127.0.0.1:8000/api/v1'
    : `${process.env.BASE_PATH || '/api'}/sources/v1.0`;
export const APPROVAL_API_BASE = window.catalog?.standalone
  ? 'http://127.0.0.1:8000/api/approval/v1'
  : `${process.env.BASE_PATH || '/api'}/approval/v1.2`;
export const CATALOG_INVENTORY_API_BASE = window.catalog?.standalone
  ? 'http://127.0.0.1:8000/api/catalog/v1.0'
  : `${process.env.BASE_PATH || '/api'}/catalog-inventory/v1.0`;
export const RBAC_API_BASE = `${process.env.BASE_PATH || '/api'}/rbac/v1`;
export const permissionValues = ['order', 'read', 'update'];

export const permissionOptions = [
  {
    value: 'order,read,update',
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
