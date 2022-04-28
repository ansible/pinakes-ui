import {
  FETCH_NOTIFICATION_SETTING,
  FETCH_NOTIFICATION_SETTINGS,
  FETCH_NOTIFICATION_TYPES,
  SORT_NOTIFICATION_SETTINGS,
  SET_FILTER_NOTIFICATION_SETTINGS,
  CLEAR_FILTER_NOTIFICATION_SETTINGS,
  UPDATE_NOTIFICATION_SETTING
} from '../action-types';

// Initial State
export const notificationSettingsInitialState = {
  notificationSettings: {
    data: [],
    meta: {
      count: 0,
      limit: 50,
      offset: 0
    }
  },
  notificationTypes: {
    data: [],
    meta: {
      count: 0,
      limit: 50,
      offset: 0
    }
  },
  notificationSetting: {},
  filterValue: '',
  isLoading: false,
  isRecordLoading: false,
  isUpdating: 0,
  sortBy: {
    index: 2,
    property: 'sequence',
    direction: 'asc'
  }
};

const setLoadingState = (state) => ({ ...state, isLoading: true });
const setRecordLoadingState = (state) => ({ ...state, isRecordLoading: true });
const setNotificationSettings = (state, { payload }) => ({
  ...state,
  notificationSettings: payload,
  isLoading: false
});
const selectNotificationSetting = (state, { payload }) => ({
  ...state,
  notificationSetting: payload,
  isRecordLoading: false
});
const setNotificationTypes = (state, { payload }) => ({
  ...state,
  notificationTypes: payload,
  isLoading: false
});

const setSortNotificationSettings = (state, { payload }) => ({
  ...state,
  sortBy: payload,
  notificationSettings: {
    ...state.notificationSettings,
    meta: {
      ...state.notificationSettings.meta,
      offset: 0
    }
  }
});
const setFilterValue = (state, { payload }) => ({
  ...state,
  filterValue: payload,
  notificationSettings: {
    ...state.notificationSettings,
    meta: {
      ...state.notificationSettings.meta,
      offset: 0
    }
  }
});

const setUpdatingNotificationSetting = (state) => ({
  ...state,
  isUpdating: state.isUpdating + 1
});
const finishUpdatingNotificationSetting = (state) => ({
  ...state,
  isUpdating: state.isUpdating - 1
});

const clearFilterValue = (state) => ({
  ...state,
  filterValue: ''
});

export default {
  [`${FETCH_NOTIFICATION_SETTINGS}_PENDING`]: setLoadingState,
  [`${FETCH_NOTIFICATION_SETTINGS}_FULFILLED`]: setNotificationSettings,
  [`${FETCH_NOTIFICATION_SETTING}_PENDING`]: setRecordLoadingState,
  [`${FETCH_NOTIFICATION_SETTING}_FULFILLED`]: selectNotificationSetting,
  [`${FETCH_NOTIFICATION_TYPES}_PENDING`]: setLoadingState,
  [`${FETCH_NOTIFICATION_TYPES}_FULFILLED`]: setNotificationTypes,
  [`${UPDATE_NOTIFICATION_SETTING}_PENDING`]: setUpdatingNotificationSetting,
  [`${UPDATE_NOTIFICATION_SETTING}_FULFILLED`]: finishUpdatingNotificationSetting,
  [`${UPDATE_NOTIFICATION_SETTING}_REJECTED`]: finishUpdatingNotificationSetting,
  [SORT_NOTIFICATION_SETTINGS]: setSortNotificationSettings,
  [SET_FILTER_NOTIFICATION_SETTINGS]: setFilterValue,
  [CLEAR_FILTER_NOTIFICATION_SETTINGS]: clearFilterValue
};
