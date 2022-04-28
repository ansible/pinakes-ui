import * as ActionTypes from '../action-types';
import * as NotificationSettingHelper from '../../helpers/notification/notification-helper';
import notificationMessages from '../../messages/notification.messages';

export const fetchNotificationSettings = (pagination) => (
  dispatch,
  getState
) => {
  const {
    notificationSettings,
    filterValue
  } = getState().notificationSettingsReducer;

  let finalPagination = pagination;

  if (!pagination && notificationSettings) {
    const { limit, offset } = notificationSettings.meta;
    finalPagination = { limit, offset };
  }

  return dispatch({
    type: ActionTypes.FETCH_NOTIFICATION_SETTINGS,
    payload: NotificationSettingHelper.fetchNotificationSettings(
      filterValue,
      finalPagination
    )
  });
};

export const fetchNotificationSetting = (apiProps) => ({
  type: ActionTypes.FETCH_NOTIFICATION_SETTING,
  payload: NotificationSettingHelper.fetchNotificationSetting(apiProps)
});

export const fetchNotificationTypes = (apiProps) => ({
  type: ActionTypes.FETCH_NOTIFICATION_TYPES,
  payload: NotificationSettingHelper.listNotificationTypes(apiProps)
});

export const addNotificationSetting = (notificationSettingData, intl) => ({
  type: ActionTypes.ADD_NOTIFICATION_SETTING,
  payload: NotificationSettingHelper.addNotificationSetting(
    notificationSettingData
  ),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: intl.formatMessage(
          notificationMessages.addNotificationSuccessTitle
        ),
        description: intl.formatMessage(
          notificationMessages.addNotificationSuccessDescription
        )
      }
    }
  }
});

export const updateNotificationSetting = (notification_settingData, intl) => ({
  type: ActionTypes.UPDATE_NOTIFICATION_SETTING,
  payload: NotificationSettingHelper.updateNotificationSetting(
    notification_settingData
  ),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: intl.formatMessage(
          notificationMessages.updateNotificationSuccessTitle
        ),
        description: intl.formatMessage(
          notificationMessages.updateNotificationSuccessDescription
        )
      }
    }
  }
});

export const removeNotificationSetting = (notification_setting, intl) => ({
  type: ActionTypes.REMOVE_NOTIFICATION_SETTING,
  payload: NotificationSettingHelper.removeNotificationSetting(
    notification_setting
  ),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: intl.formatMessage(
          notificationMessages.removeNotificationSuccessTitle
        ),
        description: intl.formatMessage(
          notificationMessages.removeNotificationSuccessDescription
        )
      }
    }
  }
});

export const removeNotificationSettings = (notification_settings, intl) => ({
  type: ActionTypes.REMOVE_NOTIFICATION_SETTINGS,
  payload: NotificationSettingHelper.removeNotificationSettings(
    notification_settings
  ),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: intl.formatMessage(
          notificationMessages.removeNotificationSuccessTitle
        ),
        description: intl.formatMessage(
          notificationMessages.removeNotificationSuccessDescription
        )
      }
    }
  }
});

export const setFilterValueNotificationSettings = (filterValue) => ({
  type: ActionTypes.SET_FILTER_NOTIFICATION_SETTINGS,
  payload: filterValue
});

export const clearFilterValueNotificationSettings = () => ({
  type: ActionTypes.CLEAR_FILTER_NOTIFICATION_SETTINGS
});
