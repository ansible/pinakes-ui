const { defineMessages } = require('react-intl');

const apsTabsMessages = defineMessages({
  myRequests: {
    id: 'tabs.myRequests',
    defaultMessage: 'My requests'
  },
  allRequests: {
    id: 'tabs.allRequests',
    defaultMessage: 'All requests'
  },
  approvalProccess: {
    id: 'tabs.approvalProcess',
    defaultMessage: 'Approval processes'
  },
  templates: {
    id: 'tabs.templates',
    defaultMessage: 'Templates'
  },
  notificationSettings: {
    id: 'tabs.notificationSettings',
    defaultMessage: 'Notification settings'
  }
});

export default apsTabsMessages;
