const { defineMessages } = require('react-intl');

const formsMessages = defineMessages({
  orderProcessTitle: {
    id: 'commonMessages.orderProcessesTitle',
    defaultMessage: 'Order processes'
  },
  inviteGroup: {
    id: 'forms.share.invite-group',
    defaultMessage: 'Invite group'
  },
  groupsAccess: {
    id: 'forms.groups-with-access',
    defaultMessage: 'Groups with access'
  },
  groupsPlaceholder: {
    id: 'share.groups.group.placeholder',
    defaultMessage: 'Select group'
  },
  permissionsPlaceholder: {
    id: 'share.groups.permissions.placeholder',
    defaultMessage: 'Select permission'
  },
  orderProcessName: {
    id: 'forms.orders.processName',
    defaultMessage: 'Order process name'
  },
  enterOrderProcessName: {
    id: 'forms.orders.enterOrderProcessName',
    defaultMessage: 'Enter a name for the order process'
  },
  nameTaken: {
    id: 'forms.orders.nameTaken',
    defaultMessage: 'Name has already been taken'
  }
});

export default formsMessages;
