import { getWorkflowApi, getAxiosInstance } from '../shared/user-login';
import { APPROVAL_API_BASE } from '../../utilities/constants';
import { defaultSettings } from '../shared/pagination';

export const getApprovalWorkflows = () => getWorkflowApi().listWorkflows();

export const loadWorkflowOptions = (filterValue = '') =>
  getAxiosInstance()
    .get(
      `${APPROVAL_API_BASE}/workflows${
        filterValue.length > 0 ? `/?filter[name][contains]=${filterValue}` : ''
      }`
    )
    .then(({ data }) =>
      data.map(({ id, name }) => ({ label: name, value: id }))
    );

export const updateWorkflows = (unlinkIds, linkIds, resourceObject) => {
  const unlinkPromises = unlinkIds
    ? unlinkIds.map((wf) => getWorkflowApi().unlinkWorkflow(wf, resourceObject))
    : [];
  const linkPromises = linkIds
    ? linkIds.map((wf) => getWorkflowApi().linkWorkflow(wf, resourceObject))
    : [];
  return Promise.all([...unlinkPromises, ...linkPromises]);
};

export const listWorkflowsForObject = (
  resourceObject,
  pagination = { limit: defaultSettings.limit, offset: defaultSettings.offset },
  filter = ''
) => {
  const objectQuery = `app_name=${resourceObject.appName}&object_type=${resourceObject.objectType}&object_id=${resourceObject.objectId}`;
  const paginationQuery = `&limit=${pagination.limit}&offset=${pagination.offset}`;
  const filterQuery = `&filter[name][contains]=${filter}`;
  return getAxiosInstance().get(
    `${APPROVAL_API_BASE}/workflows/?${objectQuery}${filterQuery}${paginationQuery}`
  );
};
