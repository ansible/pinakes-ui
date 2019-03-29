import { getRbacGroupApi } from '../shared/user-login';

const api = getRbacGroupApi();

export async function getRbacGroups() {
  return await api.listGroups();
}

//export const getRbacGroups = () => fetch(`${RBAC_API_BASE}/groups/`).then(data => data.json());
