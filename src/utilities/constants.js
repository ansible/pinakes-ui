export const CATALOG_API_BASE = `${process.env.BASE_PATH}/catalog/v1.0`;
export const SOURCES_API_BASE = `${process.env.BASE_PATH}/sources/v1.0`;
export const APPROVAL_API_BASE = `${process.env.BASE_PATH}/approval/v1.0`;
export const TOPOLOGICAL_INVENTORY_API_BASE = `${process.env.BASE_PATH}/topological-inventory/v1.0`;
export const RBAC_API_BASE = `${process.env.BASE_PATH}/rbac/v1`;

export const permissionOptions = [{
  value: 'catalog:portfolios:order,catalog:portfolios:read,catalog:portfolios:write',
  label: 'Can order/edit'
}, {
  value: 'catalog:portfolios:order,catalog:portfolios:read', label: 'Can order/view'
}];
