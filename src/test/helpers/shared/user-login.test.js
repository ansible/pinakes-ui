import { getTopologicalUserApi, getUserApi } from '../../../Helpers/Shared/userLogin';
import { TOPOLOGICAL_INVENTORY_API_BASE, SERVICE_PORTAL_API_BASE } from '../../../Utilities/Constants';

describe('user login', () => {
  it('should set correct basePath for topological api instance', () => {
    const topologicalAPi = getTopologicalUserApi();
    expect(topologicalAPi.apiClient.basePath).toEqual(TOPOLOGICAL_INVENTORY_API_BASE);
  });

  it('should set correct basePath for ssp api instance', () => {
    const sspApi = getUserApi();
    expect(sspApi.apiClient.basePath).toEqual(SERVICE_PORTAL_API_BASE);
  });
});
