const { defineMessages } = require('react-intl');

const notificationMessages = defineMessages({
  edit: {
    id: 'notificationMessages.edit',
    defaultMessage: 'Edit'
  },
  editInformation: {
    id: 'notificationMessages.editInformation',
    defaultMessage: 'Edit information'
  },
  deleteNotificationTitle: {
    id: 'notificationMessages.deleteNotificationTitle',
    defaultMessage: 'Delete notification'
  },
  notification: {
    id: 'notificationMessages.notification',
    defaultMessage: 'notification'
  },
  notifications: {
    id: 'notificationMessages.notifications',
    defaultMessage: 'notifications'
  },
  noNotifications: {
    id: 'notificationMessages.noNotifications',
    defaultMessage: 'No notifications'
  },
  createNotification: {
    id: 'notificationMessages.createNotification',
    defaultMessage: 'Create notification'
  },
  removeNotificationTitle: {
    id: 'notificationMessages.removeNotificationTitle',
    defaultMessage:
      'Delete {count, plural, one {notification} other {notifications}}?'
  },
  removeNotificationAriaLabel: {
    id: 'notificationMessages.removeNotificationTitle',
    defaultMessage:
      'Delete {count, plural, one {notification} other {notifications}} modal'
  },
  removeNotificationDescription: {
    id: 'notificationMessages.removeNotificationDescription',
    defaultMessage: '{name} will be removed.'
  },
  removeNotificationDescriptionWithDeps: {
    id: 'notificationMessages.removeNotificationDescriptionWithDeps',
    defaultMessage:
      '{name} will be removed from the following applications: {dependenciesList}'
  },
  editNotificationTitle: {
    id: 'notificationMessages.editNotificationTitle',
    defaultMessage: 'Make any changes to notification {name}'
  },
  addNotificationSuccessTitle: {
    id: 'notificationMessages.addNotificationSuccessTitle',
    defaultMessage: 'Success adding notification'
  },
  addNotificationSuccessDescription: {
    id: 'notificationMessages.addNotificationSuccessDescription',
    defaultMessage: 'The notification was added successfully.'
  },
  updateNotificationSuccessTitle: {
    id: 'notificationMessages.updateNotificationSuccessTitle',
    defaultMessage: 'Success updating notification'
  },
  updateNotificationSuccessDescription: {
    id: 'notificationMessages.updateNotificationSuccessDescription',
    defaultMessage: 'The notification was updated successfully.'
  },
  repositionNotificationSuccessTitle: {
    id: 'notificationMessages.repositionNotificationSuccessTitle',
    defaultMessage: 'Success updating notification sequence'
  },
  repositionNotificationSuccessDescription: {
    id: 'notificationMessages.repositionNotificationSuccessDescription',
    defaultMessage: `The notification' sequence was updated successfully.`
  },
  removeNotificationSuccessTitle: {
    id: 'notificationMessages.removeNotificationSuccessTitle',
    defaultMessage: 'Success removing notification'
  },
  removeNotificationSuccessDescription: {
    id: 'notificationMessages.removeNotificationSuccessDescription',
    defaultMessage: 'The notification was removed successfully.'
  },
  removeNotificationsSuccessTitle: {
    id: 'notificationMessages.removeNotificationsSuccessTitle',
    defaultMessage: 'Success removing notifications'
  },
  removeNotificationsSuccessDescription: {
    id: 'notificationMessages.removeNotificationsSuccessDescription',
    defaultMessage: 'The selected notifications were removed successfully.'
  },
  type: {
    id: 'notificationMessages.type',
    defaultMessage: 'Notification type'
  },
  settings: {
    id: 'notificationMessages.settings',
    defaultMessage: 'Settings'
  }
});

export default notificationMessages;
