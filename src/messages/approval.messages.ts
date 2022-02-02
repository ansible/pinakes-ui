import { defineMessages } from 'react-intl';

const approvalMessages = defineMessages({
  unlinkNotification: {
    id: 'approval.notifications.unlink',
    defaultMessage: 'Approval processes were unlinked successfully.'
  },
  linkNotification: {
    id: 'approval.notifications.link',
    defaultMessage: 'Approval processes were linked successfully.'
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
