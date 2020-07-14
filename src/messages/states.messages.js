const { defineMessages } = require('react-intl');

const statesMessages = defineMessages({
  title: {
    id: 'common.states.title',
    defaultMessage: 'State'
  },
  ordered: {
    id: 'common.states.ordered',
    defaultMessage: 'Ordered'
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
  },
  undecided: {
    id: 'common.states.undecided',
    defaultMessage: 'Undecided'
  },
  approved: {
    id: 'common.states.approved',
    defaultMessage: 'Approved'
  },
  denied: {
    id: 'common.states.denied',
    defaultMessage: 'Denied'
  },
  error: {
    id: 'common.states.error',
    defaultMessage: 'Error'
  }
});

export default statesMessages;
