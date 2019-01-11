export const DEFAULT_PAGE_SIZE = 50;

const topoApiHost = process.env.TOPO_API_HOST || '';
const topoApiPort = process.env.TOPO_API_PORT || '443';
const topoBasePath = process.env.TOPO_BASE_PATH;
const topoApiVersion = process.env.TOPO_API_VERSION || '/api/v0.0';
export const SOURCES_API_BASE = `https://${topoApiHost}:${topoApiPort}${topoBasePath}${topoApiVersion.replace(/\/+$/, '')}`;

const apiHost = process.env.API_HOST || 'localhost';
const apiPort = process.env.API_PORT || '5000';
const basePath = process.env.BASE_PATH || '';
const apiVersion = process.env.API_VERSION || '/api/v0.0';
export const SERVICE_PORTAL_API_BASE = `https://${apiHost}:${apiPort}${basePath}${apiVersion.replace(/\/+$/, '')}`;
