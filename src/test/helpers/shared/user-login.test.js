import { getTopologicalUserApi, getPortfolioApi } from '../../../helpers/shared/user-login';
import { TOPOLOGICAL_INVENTORY_API_BASE, CATALOG_API_BASE } from '../../../utilities/constants';

describe('user login', () => {
  it('should set correct basePath for topological api instance', () => {
    const topologicalAPi = getTopologicalUserApi();
    expect(topologicalAPi.apiClient.basePath).toEqual(TOPOLOGICAL_INVENTORY_API_BASE);
  });

  it('should set correct basePath for ssp api instance', () => {
    const sspApi = getPortfolioApi();
    expect(sspApi.basePath).toEqual(CATALOG_API_BASE);
  });
});
