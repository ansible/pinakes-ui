import { getUserApi } from '../Shared/userLogin';

const api = getUserApi();

export function addPlatform(providerData) {
  return api.addProvider(providerData).then(data => data, error => console.error(error));
}
