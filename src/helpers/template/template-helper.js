import { getAxiosInstance } from '../shared/user-login';
import { defaultSettings } from '../shared/pagination';
import { APPROVAL_API_BASE } from '../../utilities/approval-constants';

export function fetchTemplates(filter = '', pagination = defaultSettings) {
  const paginationQuery = `&page_size=${Math.max(
    pagination.limit,
    10
  )}&page=${pagination.offset || 1}`;
  const filterQuery = `&title=${filter}`;
  return getAxiosInstance().get(
    `${APPROVAL_API_BASE}/templates/?${filterQuery}${paginationQuery}`
  );
}

export const fetchTemplatesOptions = (filterValue) => {
  const filterQuery = `?search=${filterValue}`;
  return getAxiosInstance()
    .get(
      `${APPROVAL_API_BASE}/templates/${
        filterValue && filterValue.length > 0 ? filterQuery : ''
      }`
    )
    .then(({ data }) =>
      data && data.length > 0
        ? data.map(({ id, title }) => ({ label: title, value: id }))
        : []
    );
};

export let fetchTemplate = (id) =>
  getAxiosInstance().get(`${APPROVAL_API_BASE}/templates/${id}/`);

export let fetchTemplateByName = (name) => {
  return getAxiosInstance().get(
    `${APPROVAL_API_BASE}/templates/?title=${name}`
  );
};

export function updateTemplate(data) {
  return getAxiosInstance().patch(
    `${APPROVAL_API_BASE}/templates/${data.id}/`,
    data
  );
}

export function addTemplate(data) {
  return getAxiosInstance().post(`${APPROVAL_API_BASE}/templates/`, data);
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
