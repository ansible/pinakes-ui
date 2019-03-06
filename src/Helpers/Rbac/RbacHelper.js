import { getRbacUserApi } from '../Shared/userLogin';

const api = getRbacUserApi();

export function getGroups() {
  return api.listGroups();
}

export function getGroup(name) {
  return api.getGroup(name);
}
