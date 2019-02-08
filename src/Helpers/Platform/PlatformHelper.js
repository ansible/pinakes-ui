import { getTopologicalUserApi } from '../Shared/userLogin';
import { TOPOLOGICAL_INVENTORY_API_BASE } from '../../Utilities/Constants';

const api = getTopologicalUserApi();

export function getPlatforms() {
  return api.listSources();
}

export function getPlatform(platformId) {
  return api.showSource(platformId);
}

export function getPlatformItems(apiProps) {
  let apiPromise = null;

  if (apiProps) {
    apiPromise = fetch(`${TOPOLOGICAL_INVENTORY_API_BASE}/sources/${apiProps}/service_offerings?archived_at=`).then(data => data.json());
  } else {
    apiPromise = api.listServiceOfferings();
  }

  return apiPromise;
}
