import { getAxiosInstance } from '../shared/user-login';
import { defaultSettings } from '../shared/pagination';
import { APPROVAL_API_BASE } from '../../utilities/approval-constants';

export function fetchNotificationSettings(
  filter = '',
  pagination = defaultSettings
) {
  const paginationQuery = `&page_size=${
    pagination.limit
  }&page=${pagination.offset || 1}`;
  const filterQuery = `&search=${filter}`;

  return getAxiosInstance().get(
    `${APPROVAL_API_BASE}/notifications_settings/?${filterQuery}${paginationQuery}`
  );
}

export const fetchNotificationSetting = (id) =>
  getAxiosInstance().get(`${APPROVAL_API_BASE}/notifications_settings/${id}/`);

export let fetchNotificationSettingByName = (name) =>
  getAxiosInstance().get(
    `${APPROVAL_API_BASE}/notifications_settings/?name=${name}`
  );

export function updateNotificationSetting(data) {
  return getAxiosInstance().patch(
    `${APPROVAL_API_BASE}/notifications_settings/${data.id}/`,
    data
  );
}

export const listNotificationSettings = () =>
  getAxiosInstance().get(`${APPROVAL_API_BASE}/notifications_settings/`);

export function addNotificationSetting(data) {
  return getAxiosInstance().post(
    `${APPROVAL_API_BASE}/notifications_settings/`,
    data
  );
}

export function destroyNotificationSetting(notificationSettingId) {
  return getAxiosInstance().delete(
    `${APPROVAL_API_BASE}/notifications_settings/${notificationSettingId}/`
  );
}

export async function removeNotificationSetting(notificationSettingId) {
  return await destroyNotificationSetting(notificationSettingId);
}

export async function removeNotificationSettings(selectedNotificationSettings) {
  return Promise.all(
    selectedNotificationSettings.map(
      async (notificationSettingId) =>
        await destroyNotificationSetting(notificationSettingId)
    )
  );
}

export const fetchNotificationTypes = (filterValue) => {
  const filterQuery = `?search=${filterValue}`;
  return getAxiosInstance()
    .get(
      `${APPROVAL_API_BASE}/notification_types/${
        filterValue && filterValue.length > 0 ? filterQuery : ''
      }`
    )
    .then(({ data }) =>
      data && data.length > 0
        ? data.map(({ id, n_type }) => ({ label: n_type, value: id }))
        : undefined
    );
};

export const fetchNotificationSettingsOptions = (filterValue) => {
  const filterQuery = `?search=${filterValue}`;
  return getAxiosInstance()
    .get(
      `${APPROVAL_API_BASE}/notifications_settings/${
        filterValue && filterValue.length > 0 ? filterQuery : ''
      }`
    )
    .then(({ data }) =>
      data && data.length > 0
        ? data.map(({ id, name }) => ({ label: name, value: id }))
        : []
    );
};

export const listNotificationTypes = (filterValue) => {
  const filterQuery = `?search=${filterValue}`;
  return getAxiosInstance().get(
    `${APPROVAL_API_BASE}/notification_types/${
      filterValue && filterValue.length > 0 ? filterQuery : ''
    }`
  );
};
