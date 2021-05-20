import { defineMessages } from 'react-intl';

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
    defaultMessage: 'Set order processes for <strong>{object}</strong>'
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
  },
  orderProcessType: {
    id: 'order-process-type',
    defaultMessage: 'Order process type'
  },
  orderProcesses: {
    id: 'order-process.orderProcesses',
    defaultMessage: 'order processes'
  },
  removeProcessSuccessTitle: {
    id: 'order-process.removeProcessSuccessTitle',
    defaultMessage: 'Success removing order process'
  },
  removeProcessSuccessDescription: {
    id: 'order-process.removeProcessSuccessDescription',
    defaultMessage: 'The order process was removed successfully.'
  },
  removeProcessesSuccessTitle: {
    id: 'order-process.removeProcessesSuccessTitle',
    defaultMessage: 'Success removing order processes'
  },
  removeProcessesSuccessDescription: {
    id: 'order-process.removeProcessesSuccessDescription',
    defaultMessage: 'The selected order processes were removed successfully.'
  },
  deleteOrderProcess: {
    id: 'order-process.deleteProcessAriaMenu',
    defaultMessage: 'Delete order processes'
  },
  removeProcessTitle: {
    id: 'order-process.removeProcessTitle',
    defaultMessage:
      'Delete {count, plural, one {order process} other {order processes}}?'
  },
  removeProcessAriaLabel: {
    id: 'order-process.removeProcessAriaLabel',
    defaultMessage:
      'Delete {count, plural, one {order process} other {order processes}} modal'
  },
  removeProcessDescription: {
    id: 'order-process.removeProcessDescription',
    defaultMessage: '{name} will be removed.'
  },
  updateProcessSuccessTitle: {
    id: 'order-process.actions.updateProcessSuccessTitle',
    defaultMessage: 'Order process {name} was updated'
  },
  updateOrderProcess: {
    id: 'order-process.actions.updateOrderProcess',
    defaultMessage: 'Edit order process'
  },
  createOrderProcess: {
    id: 'order-process.actions.createOrderProcess',
    defaultMessage: 'Create order process'
  }
});

export default orderProcessesMessages;
