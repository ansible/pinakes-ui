import labelMessages from './labels.messages';

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
  },
  pending: {
    id: 'common.states.pending',
    defaultMessage: 'Pending'
  },
  skipped: {
    id: 'common.states.skipped',
    defaultMessage: 'Skipped'
  },
  started: {
    id: 'common.states.started',
    defaultMessage: 'Started'
  },
  notified: {
    id: 'common.states.notified',
    defaultMessage: 'Notified'
  }
});

export const getTranslatableState = (state) =>
  state.replace(/\s/g, '').replace(/^./, (char) => char.toLowerCase());

/**
 * We must include the created state so the dynamic data from DB can look for these messages in one place
 * The created message is shared among other components and is just a state message
 */
export default { ...statesMessages, created: labelMessages.created };
