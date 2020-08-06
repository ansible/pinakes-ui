const { defineMessages } = require('react-intl');

const approvalMessages = defineMessages({
  unlinkNotification: {
    id: 'approval.notifications.unlink',
    defaultMessage:
      '{count, number} {count, plural, one {approval process was} other {approval processes were}} unlinked successfully.'
  },
  linkNotification: {
    id: 'approval.notifications.link',
    defaultMessage:
      '{count, number} {count, plural, one {approval process was} other {approval processes were}} linked successfully.'
  },
  setWorkflow: {
    id: 'approval.workflows.set',
    defaultMessage:
      'Select approval processes for <strong>{objectName}</strong>'
  },
  currentWorkflows: {
    id: 'approval.workflows.current',
    defaultMessage: 'Current approval processes'
  }
});

export default approvalMessages;
