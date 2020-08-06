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
  orderProcess: {
    id: 'order-process.toolbar.order-process',
    defaultMessage: 'Order process'
  },
  addProcessSuccessTitle: {
    id: 'order-process.actions.addProcessSuccessTitle',
    defaultMessage: 'Success adding order process'
  },
  addProcessSuccessDescription: {
    id: 'order-process.actions.addProcessSuccessDescription',
    defaultMessage: 'The order process was added successfully.'
  },
  setOrderProcess: {
    id: 'order-process.actions.set',
    defaultMessage: 'Set order processes'
  },
  setOrderProcessSubtitle: {
    id: 'order-process.tags.set',
    defaultMessage: 'Set order processes for <strong>{objectType}</strong>'
  },
  currentOrderProcesses: {
    id: 'order-process.set-order-process.current',
    defaultMessage: 'Current order processes'
  },
  setOrderProcessNotificationTitle: {
    id: 'order-process.notification.title',
    defaultMessage: 'Success updating order process'
  },
  setOrderProcessNotificationDescription: {
    id: 'order-process.notification.description',
    defaultMessage:
      // eslint-disable-next-line max-len
      '{linked, plural, =0 {} other {{linked, number} {linked, plural, one {order process was} other {order processes were}} linked.}} {unlinked, plural, =0{} other {{unlinked, number} {unlinked, plural, one {order process was} other {order processes were}} unlinked.}}'
  },
  orderProcessName: {
    id: 'order-process.name',
    defaultMessage: 'Order process name'
  },
  enterOrderProcessName: {
    id: 'order-process.enterName',
    defaultMessage: 'Enter a name for the order process'
  }
});

export default orderProcessesMessages;
