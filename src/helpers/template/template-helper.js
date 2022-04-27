import { getAxiosInstance } from '../shared/user-login';
import { defaultSettings } from '../shared/pagination';
import { APPROVAL_API_BASE } from '../../utilities/approval-constants';

export function fetchTemplates(filter = '', pagination = defaultSettings) {
  const paginationQuery = `&page_size=${Math.max(
    pagination.limit,
    10
  )}&page=${pagination.offset || 1}`;
  const filterQuery = `&name=${filter}`;

  return getAxiosInstance().get(
    `${APPROVAL_API_BASE}/templates/?${filterQuery}${paginationQuery}`
  );
}

export const fetchTemplate = (id) =>
  getAxiosInstance().get(`${APPROVAL_API_BASE}/templates/${id}/`);

export let fetchTemplateByName = (name) =>
  getAxiosInstance().get(`${APPROVAL_API_BASE}/templates/?name=${name}`);

export function updateTemplate(data) {
  return getAxiosInstance().patch(
    `${APPROVAL_API_BASE}/templates/${data.id}`,
    data
  );
}

export function repositionTemplate(data) {
  return getAxiosInstance().patch(
    `${APPROVAL_API_BASE}/templates/${data.id}`,
    data.sequence
  );
}

export const listTemplates = () =>
  getAxiosInstance().get(`${APPROVAL_API_BASE}/templates/`);

export function addTemplateToTemplate(templateId, template) {
  return getAxiosInstance().post(
    `${APPROVAL_API_BASE}/templates/${templateId}/templates/`,
    template
  );
}

export function addTemplate(template) {
  return listTemplates()
    .then(({ data }) => {
      // workaround for v1. Need to pass template ID with the template. Assigning to first template
      if (!data[0]) {
        throw new Error('No template exists');
      }

      return data[0].id;
    })
    .then((id) => addTemplateToTemplate(id, template));
}

export function destroyTemplate(templateId) {
  return getAxiosInstance().delete(
    `${APPROVAL_API_BASE}/templates/${templateId}/`
  );
}

export async function removeTemplate(templateId) {
  return await destroyTemplate(templateId);
}

export async function removeTemplates(selectedTemplates) {
  return Promise.all(
    selectedTemplates.map(
      async (templateId) => await destroyTemplate(templateId)
    )
  );
}
