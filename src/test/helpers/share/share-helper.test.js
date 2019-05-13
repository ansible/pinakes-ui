import { CATALOG_API_BASE } from '../../../utilities/constants';
import { getShareInfo, sharePortfolio, unsharePortfolio } from '../../../helpers/share/share-helper';

describe('share helper', () => {
  it('should call get share helper', done => {
    expect.assertions(1);
    apiClientMock.get(`${CATALOG_API_BASE}/portfolios/123/share_info`, mockOnce((req, res) => {
      expect(req).toBeTruthy();
      done();
      return res.status(200);
    }));
    getShareInfo(123);
  });

  it('should call get share portfolio', done => {
    expect.assertions(1);
    apiClientMock.post(`${CATALOG_API_BASE}/portfolios/123/share`, mockOnce((req, res) => {
      expect(req).toBeTruthy();
      done();
      return res.status(200);
    }));
    sharePortfolio({ id: '123', permissions: 'foo,bar', group_uuid: '123' });
  });

  it('should call get unshare portfolio', done => {
    expect.assertions(1);
    apiClientMock.post(`${CATALOG_API_BASE}/portfolios/123/unshare`, mockOnce((req, res) => {
      expect(req).toBeTruthy();
      done();
      return res.status(200);
    }));
    unsharePortfolio({ id: '123', permissions: 'foo,bar', group_uuid: '123' });
  });
});
