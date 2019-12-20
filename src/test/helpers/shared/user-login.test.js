import {
  getSourcesApi,
  getPortfolioApi
} from '../../../helpers/shared/user-login';
import {
  SOURCES_API_BASE,
  CATALOG_API_BASE
} from '../../../utilities/constants';

describe('user login', () => {
  it('should set correct basePath for sources api instance', () => {
    const sources = getSourcesApi();
    expect(sources.basePath).toEqual(SOURCES_API_BASE);
  });

  it('should set correct basePath for ssp api instance', () => {
    const sspApi = getPortfolioApi();
    expect(sspApi.basePath).toEqual(CATALOG_API_BASE);
  });
});
