import * as ApprovalHelper from '../../../helpers/approval/approval-helper-s';
import { getAxiosInstance } from '../../../helpers/shared/user-login';
import {
  APPROVAL_API_BASE,
  CATALOG_API_BASE,
  CATALOG_INVENTORY_API_BASE
} from '../../../utilities/constants';
import { mockApi } from '../../../helpers/shared/__mocks__/user-login';

describe('Approval helper', () => {
  const getSpy = jest.spyOn(getAxiosInstance(), 'get').mockImplementation(
    (...args) =>
      new Promise((res) =>
        res({
          results: [],
          axiosArgs: args
        })
      )
  );

  const axiosPostSpy = jest.spyOn(getAxiosInstance(), 'post');

  beforeEach(() => {
    localStorage.setItem('catalog_standalone', true);
    localStorage.setItem('user', 'testUser');
    mockApi.onGet(`${CATALOG_API_BASE}/me/`).replyOnce(200, {
      username: 'fred',
      first_name: 'Fred',
      last_name: 'Flintstone'
    });
  });

  afterEach(() => {
    getSpy.mockReset();
    axiosPostSpy.mockReset();
    localStorage.setItem('catalog_standalone', false);
    localStorage.removeItem('user');
  });

  it('should build correct url for workflows initial lookup query', () => {
    mockApi
      .onGet(
        `${APPROVAL_API_BASE}/workflows?app_name=catalog&object_type=Portfolio&object_id=123&filter[name][contains]=&page_size=50&page=1`
      )
      .reply(200, {
        results: [
          {
            name: 'workflow1',
            id: '111'
          }
        ]
      });

    return ApprovalHelper.loadWorkflowOptions('some-filter-value', [
      'initial-id-1',
      'initial-id-2'
    ]).then(() => {
      const expectedFilterFragment =
        '&filter[id][]=initial-id-1&filter[id][]=initial-id-2';
      expect(getSpy).toHaveBeenCalledWith(
        `${APPROVAL_API_BASE}/workflows/?search=some-filter-value&id=initial-id-1&id=initial-id-2`
      );
    });
  });

  it('should call link and unlink workflows with correct arguments', () => {
    mockApi.onGet(`${CATALOG_API_BASE}/me/`).replyOnce(200, {
      username: 'User1',

      first_name: 'First',
      last_name: 'Last'
    });
    mockApi
      .onPost(`${APPROVAL_API_BASE}/workflows/unlink-id-1/unlink/`)
      .replyOnce((req) => {
        expect(JSON.parse(req.data)).toEqual({
          object_type: 'Portfolio',
          app_name: 'catalog',
          object_id: '5'
        });
        return [204];
      });

    mockApi
      .onPost(`${APPROVAL_API_BASE}/workflows/unlink-id-2/unlink/`)
      .replyOnce((req) => {
        expect(JSON.parse(req.data)).toEqual({
          object_type: 'Portfolio',
          app_name: 'catalog',
          object_id: '5'
        });
        return [204];
      });
    mockApi
      .onPost(`${APPROVAL_API_BASE}/workflows/link-id-1/link/`)
      .replyOnce((req) => {
        expect(JSON.parse(req.data)).toEqual({
          object_type: 'Portfolio',
          app_name: 'catalog',
          object_id: '5'
        });
        return [204];
      });
    mockApi
      .onPost(`${APPROVAL_API_BASE}/workflows/link-id-2/link/`)
      .replyOnce((req) => {
        expect(JSON.parse(req.data)).toEqual({
          object_type: 'Portfolio',
          app_name: 'catalog',
          object_id: '5'
        });
        return [204];
      });

    return ApprovalHelper.updateWorkflows(
      ['unlink-id-1', 'unlink-id-2'],
      ['link-id-1', 'link-id-2'],
      {
        object_type: 'Portfolio',
        app_name: 'catalog',
        object_id: '5'
      }
    ).then((data) => {
      expect(axiosPostSpy).toHaveBeenNthCalledWith(
        1,
        `${APPROVAL_API_BASE}/workflows/unlink-id-1/unlink/`,
        { object_type: 'Portfolio', app_name: 'catalog', object_id: '5' }
      );
      expect(axiosPostSpy).toHaveBeenNthCalledWith(
        2,
        `${APPROVAL_API_BASE}/workflows/unlink-id-2/unlink/`,
        { object_type: 'Portfolio', app_name: 'catalog', object_id: '5' }
      );
      expect(axiosPostSpy).toHaveBeenNthCalledWith(
        3,
        `${APPROVAL_API_BASE}/workflows/link-id-1/link/`,
        { object_type: 'Portfolio', app_name: 'catalog', object_id: '5' }
      );
      expect(axiosPostSpy).toHaveBeenNthCalledWith(
        4,
        `${APPROVAL_API_BASE}/workflows/link-id-2/link/`,
        { object_type: 'Portfolio', app_name: 'catalog', object_id: '5' }
      );
    });
  });

  it('should not call any link and unlink workflows', () => {
    mockApi
      .onGet(
        `${APPROVAL_API_BASE}/workflows?app_name=catalog&object_type=Portfolio&object_id=123&filter[name][contains]=&page_size=50&page=1`
      )
      .reply(200, {
        results: [
          {
            name: 'workflow1',
            id: '111'
          }
        ]
      });
    return ApprovalHelper.updateWorkflows(undefined, undefined, {}).then(() => {
      expect(axiosPostSpy).not.toHaveBeenCalled();
    });
  });
});
