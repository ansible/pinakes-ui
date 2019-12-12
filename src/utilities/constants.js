export const CATALOG_API_BASE = `${process.env.BASE_PATH}/catalog/v1.0`;
export const SOURCES_API_BASE = `${process.env.BASE_PATH}/sources/v1.0`;
export const APPROVAL_API_BASE = `${process.env.BASE_PATH}/approval/v1.0`;
export const TOPOLOGICAL_INVENTORY_API_BASE = `${process.env.BASE_PATH}/topological-inventory/v1.0`;
export const RBAC_API_BASE = `${process.env.BASE_PATH}/rbac/v1`;
export const APP_NAME = 'catalog';

export const permissionValues = [
  'catalog:portfolios:order',
  'catalog:portfolios:read',
  'catalog:portfolios:update'
];

export const permissionOptions = [
  {
    value:
      'catalog:portfolios:order,catalog:portfolios:read,catalog:portfolios:update',
    label: 'Can order/edit'
  },
  {
    value: 'catalog:portfolios:order,catalog:portfolios:read',
    label: 'Can order/view'
  }
];

export const PORTFOLIO_RESOURCE_TYPE = 'Portfolio';
export const PORTFOLIO_ITEM_RESOURCE_TYPE = 'PortfolioItem';
export const INVENTORY_RESOURCE_TYPE = 'Inventory';
