import {
  loadWorkflowOptions,
  updateWorkflows
} from '../../../helpers/approval/approval-helper';
import {
  getAxiosInstance,
  getWorkflowApi
} from '../../../helpers/shared/user-login';
import { APPROVAL_API_BASE } from '../../../utilities/constants';

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
    .spyOn(getWorkflowApi(), 'unlinkWorkflow')
    .mockImplementation(() => Promise.resolve({ data: [] }));
  const linkWorkflowSpy = jest
    .spyOn(getWorkflowApi(), 'linkWorkflow')
    .mockImplementation(() => Promise.resolve({ data: [] }));

  afterEach(() => {
    getSpy.mockReset();
    unlinkWorkflowsSpy.mockReset();
    linkWorkflowSpy.mockReset();
  });
  it('should build correct url for workflows initial lookup query', () => {
    return loadWorkflowOptions('some-filter-value', [
      'initial-id-1',
      'initial-id-2'
    ]).then(() => {
      const expectedFilterFragment =
        '&filter[id][]=initial-id-1&filter[id][]=initial-id-2';
      expect(getSpy).toHaveBeenCalledWith(
        `${APPROVAL_API_BASE}/workflows?filter[name][contains]=some-filter-value${expectedFilterFragment}`
      );
    });
  });

  it('should call link and unlink workflows with correct arguments', () => {
    return updateWorkflows(
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
    return updateWorkflows(undefined, undefined, {}).then(() => {
      expect(unlinkWorkflowsSpy).not.toHaveBeenCalled();
      expect(linkWorkflowSpy).not.toHaveBeenCalled();
    });
  });
});
