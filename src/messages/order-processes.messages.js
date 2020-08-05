const { defineMessages } = require('react-intl');

const orderProcessesMessages = defineMessages({
  noOrderProcessesDescription: {
    id: 'order-proces.empty.no-order-processes',
    defaultMessage: 'No order processes found.'
  },
  noOrderProcessesFilterDescription: {
    id: 'order-process.empty.no-results',
    defaultMessage: 'No order processes match your filter criteria.'
  },
  orderProcessesFilter: {
    id: 'order-process.filter.placeholder',
    defaultMessage: 'Filter by name'
  },
  title: {
    id: 'order-process.toolbar.title',
    defaultMessage: 'Order processes'
  },
  noOrderProcesses: {
    id: 'order-process.toolbar.order-process',
    defaultMessage: 'No order processes'
  },
  orderProcesses: {
    id: 'order-process.toolbar.order-processes',
    defaultMessage: 'Order processes'
  },
  orderProcess: {
    id: 'order-process.toolbar.order-process',
    defaultMessage: 'Order process'
  },
  addProcessSuccessTitle: {
    id: 'common.actions.addProcessSuccessTitle',
    defaultMessage: 'Success adding order process'
  },
  addProcessSuccessDescription: {
    id: 'common.actions.addProcessSuccessDescription',
    defaultMessage: 'The order process was added successfully.'
  }
});

export default orderProcessesMessages;
