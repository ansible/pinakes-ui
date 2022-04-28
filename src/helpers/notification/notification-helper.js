import { getAxiosInstance } from '../shared/user-login';
import { defaultSettings } from '../shared/pagination';
import { APPROVAL_API_BASE } from '../../utilities/approval-constants';

export function fetchNotificationSettings(
  filter = '',
  pagination = defaultSettings
) {
  const paginationQuery = `&page_size=${Math.max(
    pagination.limit,
    10
  )}&page=${pagination.offset || 1}`;
  const filterQuery = `&name=${filter}`;

  return getAxiosInstance().get(
    `${APPROVAL_API_BASE}/notification_settings/?${filterQuery}${paginationQuery}`
  );
}

export const fetchNotificationSetting = (id) =>
  getAxiosInstance().get(`${APPROVAL_API_BASE}/notification_settings/${id}/`);

export let fetchNotificationSettingByName = (name) =>
  getAxiosInstance().get(
    `${APPROVAL_API_BASE}/notification_settings/?title=${name}`
  );

export function updateNotificationSetting(data) {
  return getAxiosInstance().patch(
    `${APPROVAL_API_BASE}/notification_settings/${data.id}`,
    data
  );
}

export const listNotificationSettings = () =>
  getAxiosInstance().get(`${APPROVAL_API_BASE}/notification_settings/`);

export function addNotificationSetting(data) {
  return getAxiosInstance().post(
    `${APPROVAL_API_BASE}/notification_settings/`,
    data
  );
}

export function destroyNotificationSetting(notification_settingId) {
  return getAxiosInstance().delete(
    `${APPROVAL_API_BASE}/notification_settings/${notification_settingId}/`
  );
}

export async function removeNotificationSetting(notification_settingId) {
  return await destroyNotificationSetting(notification_settingId);
}

export async function removeNotificationSettings(selectedNotificationSettings) {
  return Promise.all(
    selectedNotificationSettings.map(
      async (notificationSettingId) =>
        await destroyNotificationSetting(notificationSettingId)
    )
  );
}
