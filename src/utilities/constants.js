export const CATALOG_API_BASE = `${process.env.BASE_PATH}/catalog/v1.0`;
export const TOPOLOGICAL_INVENTORY_API_BASE = `${process.env.BASE_PATH}/topological-inventory/v0.1`;
export const APPROVAL_API_BASE = `${process.env.BASE_PATH}/approval/v1.0`;

// should be based on locale in future. Dont know why we use en-GB format in mocks
export const dateOptions = [ 'en-GB', { year: 'numeric', month: 'short', day: 'numeric' }];

export const RBAC_API_BASE = `${process.env.BASE_PATH}/rbac/v1`;
