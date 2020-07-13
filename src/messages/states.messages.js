const { defineMessages } = require('react-intl');

const statesMessages = defineMessages({
  ordered: {
    id: 'common.states.ordered',
    defaultMessages: 'Ordered'
  },
  approvalPending: {
    id: 'common.states.approval-pending',
    defaultMessage: 'Approval Pending'
  },
  canceled: {
    id: 'common.states.canceled',
    defaultMessage: 'Canceled'
  },
  completed: {
    id: 'common.states.completed',
    defaultMessage: 'Completed'
  },
  created: {
    id: 'common.states.created',
    defaultMessage: 'Created'
  },
  failed: {
    id: 'common.states.failed',
    defaultMessage: 'Failed'
  }
});

export default statesMessages;
