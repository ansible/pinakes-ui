import { getPortfolioApi } from '../../../helpers/shared/user-login';
import { CATALOG_API_BASE } from '../../../utilities/constants';

describe('user login', () => {
  it('should set correct basePath for ssp api instance', () => {
    const sspApi = getPortfolioApi();
    expect(sspApi.basePath).toEqual(CATALOG_API_BASE);
  });
});
