import { CATALOG_API_BASE } from '../../../utilities/constants';
import { getShareInfo, sharePortfolio, unsharePortfolio } from '../../../helpers/share/share-helper';
import { mockApi } from '../../__mocks__/user-login';

describe('share helper', () => {
  it('should call get share helper', done => {
    expect.assertions(1);
    mockApi.onGet(`${CATALOG_API_BASE}/portfolios/123/share_info`).replyOnce(req => {
      expect(req).toBeTruthy();
      done();
      return [ 200 ];

    });
    getShareInfo(123);
  });

  it('should call get share portfolio', async done => {
    expect.assertions(1);
    mockApi.onPost(`${CATALOG_API_BASE}/portfolios/123/share`).replyOnce(req => {
      expect(JSON.parse(req.data)).toEqual({ permissions: [ 'foo', 'bar' ], group_uuids: [ '123' ]});
      done();
      return [ 200 ];

    });
    await sharePortfolio({ id: '123', permissions: 'foo,bar', group_uuid: '123' });
  });

  it('should call get unshare portfolio', done => {
    expect.assertions(1);
    mockApi.onPost(`${CATALOG_API_BASE}/portfolios/123/unshare`).replyOnce(req => {
      expect(JSON.parse(req.data)).toEqual({ permissions: 'foo,bar', group_uuids: [ '123' ]});
      done();
      return [ 200 ];
    });
    unsharePortfolio({ id: '123', permissions: 'foo,bar', group_uuid: '123' });
  });
});
