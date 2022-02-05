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
          data: [],
          axiosArgs: args
        })
      )
  );
  const unlinkWorkflowsSpy = jest
    .spyOn(ApprovalHelper, 'unlinkWorkflow')
    .mockImplementation(() => Promise.resolve({ data: [] }));
  const linkWorkflowSpy = jest
    .spyOn(ApprovalHelper, 'linkWorkflow')
    .mockImplementation(() => Promise.resolve({ data: [] }));

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
    unlinkWorkflowsSpy.mockReset();
    linkWorkflowSpy.mockReset();
  });

  it('should call link and unlink workflows with correct arguments', () => {
    mockApi.onGet(`${CATALOG_API_BASE}/me/`).replyOnce(200, {
      username: 'fred',
      first_name: 'Fred',
      last_name: 'Flintstone'
    });
    mockApi
      .onPost(`${CATALOG_API_BASE}/portfolios/123/share`)
      .replyOnce((req) => {
        expect(JSON.parse(req.data)).toEqual({
          permissions: ['foo', 'bar'],
          group_uuids: ['123']
        });
        done();
        return [200];
      });
    return ApprovalHelper.updateWorkflows(
      ['unlink-id-1', 'unlink-id-2'],
      ['link-id-1', 'link-id-2'],
      {}
    ).then(() => {
      expect(unlinkWorkflowsSpy).toHaveBeenNthCalledWith(1, 'unlink-id-1', {});
      expect(unlinkWorkflowsSpy).toHaveBeenNthCalledWith(2, 'unlink-id-2', {});
      expect(linkWorkflowSpy).toHaveBeenNthCalledWith(1, 'link-id-1', {});
      expect(linkWorkflowSpy).toHaveBeenNthCalledWith(2, 'link-id-2', {});
    });
  });

  it('should not call any link and unlink workflows', () => {
    return ApprovalHelper.updateWorkflows(undefined, undefined, {}).then(() => {
      expect(unlinkWorkflowsSpy).not.toHaveBeenCalled();
      expect(linkWorkflowSpy).not.toHaveBeenCalled();
    });
  });
});
