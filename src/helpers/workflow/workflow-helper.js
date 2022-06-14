import { getAxiosInstance } from '../shared/user-login';
import { defaultSettings } from '../shared/pagination';
import { APPROVAL_API_BASE } from '../../utilities/approval-constants';

export function fetchWorkflows(filter = '', pagination = defaultSettings) {
  const paginationQuery = `&page_size=${Math.max(
    pagination.limit,
    10
  )}&page=${pagination.offset || 1}`;
  const filterQuery = `&search=${filter}`;

  return getAxiosInstance().get(
    `${APPROVAL_API_BASE}/workflows/?${filterQuery}${paginationQuery}`
  );
}

export const fetchWorkflow = (id) =>
  getAxiosInstance().get(`${APPROVAL_API_BASE}/workflows/${id}/`);

export let fetchWorkflowByName = (name) =>
  getAxiosInstance().get(`${APPROVAL_API_BASE}/workflows/?search=${name}`);

export function updateWorkflow(data) {
  return getAxiosInstance().patch(
    `${APPROVAL_API_BASE}/workflows/${data.id}/`,
    data
  );
}

export function repositionWorkflow(data) {
  return getAxiosInstance().patch(
    `${APPROVAL_API_BASE}/workflows/${data.id}/`,
    data.sequence
  );
}

export const listTemplates = () =>
  getAxiosInstance().get(`${APPROVAL_API_BASE}/templates/`);

export function addWorkflowToTemplate(templateId, workflow) {
  return getAxiosInstance().post(`${APPROVAL_API_BASE}/workflows/`, workflow);
}

export function addWorkflow(workflow) {
  return addWorkflowToTemplate(workflow.template, workflow);
}

export function destroyWorkflow(workflowId) {
  return getAxiosInstance().delete(
    `${APPROVAL_API_BASE}/workflows/${workflowId}/`
  );
}

export async function removeWorkflow(workflowId) {
  return await destroyWorkflow(workflowId);
}

export async function removeWorkflows(selectedWorkflows) {
  return Promise.all(
    selectedWorkflows.map(
      async (workflowId) => await destroyWorkflow(workflowId)
    )
  );
}
