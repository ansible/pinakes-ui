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
  getAxiosInstance().get(`${APPROVAL_API_BASE}/notification_settings/${id}/`);

export let fetchTemplateByName = (name) =>
  getAxiosInstance().get(
    `${APPROVAL_API_BASE}/notification_settings/?name=${name}`
  );

export function updateTemplate(data) {
  return getAxiosInstance().patch(
    `${APPROVAL_API_BASE}/templates/${data.id}`,
    data
  );
}

export const listTemplates = () =>
  getAxiosInstance().get(`${APPROVAL_API_BASE}/notification_settings/`);

export function addTemplate(data) {
  return getAxiosInstance().post(
    `${APPROVAL_API_BASE}/notification_settings/`,
    data
  );
}

export function destroyTemplate(templateId) {
  return getAxiosInstance().delete(
    `${APPROVAL_API_BASE}/notification_settings/${templateId}/`
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
