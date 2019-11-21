import { getWorkflowApi, getAxiosInstance } from '../shared/user-login';
import { APPROVAL_API_BASE } from '../../utilities/constants';
import { defaultSettings } from '../shared/pagination';

export const getApprovalWorkflows = () => getWorkflowApi().listWorkflows();

export const loadWorkflowOptions = (filterValue = '') =>
  getAxiosInstance().get(`${APPROVAL_API_BASE}/workflows${filterValue.length > 0
    ? `/?filter[name][contains]=${filterValue}`
    : ''}`)
  .then(({ data }) => data.map(({ id, name }) => ({ label: name, value: id })));

export const linkWorkflow = (id, resourceObject) => getWorkflowApi().linkWorkflow(id, resourceObject);
export const unlinkWorkflow = (id, resourceObject) => getWorkflowApi().unlinkWorkflow(id, resourceObject);

export const listWorkflowsForObject = (resourceObject, limit = defaultSettings.limit, offset = defaultSettings.offset, filter = '') => {
  const objectQuery = `app_name=${resourceObject.appName}&object_type=${resourceObject.objectType}&object_id=${resourceObject.objectId}`;
  const paginationQuery = `&limit=${limit}&offset=${offset}`;
  const filterQuery = `${filter.length > 0 ? `/?filter[name][contains]=${filter}` : ''}`;
  return getAxiosInstance().get(`${APPROVAL_API_BASE}/workflows/?${objectQuery}${filterQuery}${paginationQuery}`);
};
