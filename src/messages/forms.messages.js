const { defineMessages } = require('react-intl');

const formsMessages = defineMessages({
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
  }
});

export default formsMessages;
