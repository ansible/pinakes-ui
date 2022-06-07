import { defineMessages } from 'react-intl';

const ordersMessages = defineMessages({
  orderedBy: {
    id: 'orders.common.orderedBy',
    defaultMessage: 'Ordered by {owner}'
  },
  orderedByLabel: {
    id: 'orders.approval.orderedBy',
    defaultMessage: 'Ordered by'
  },
  lastUpdated: {
    id: 'orders.common.lastUpdated',
    defaultMessage: 'Last updated'
  },
  compositeTitle: {
    id: 'orders.common.compositeTitle',
    defaultMessage: '{name} - Order # {id}'
  },
  detailTitle: {
    id: 'orders.detail.title',
    defaultMessage: 'Order ID {id}'
  },
  orderSuccess: {
    id: 'orders.notification.success',
    defaultMessage:
      'You can track the progress of Order # {id} in your <link>Orders</link> page.'
  },
  noOrdersTitle: {
    id: 'orders.list.empty.title',
    defaultMessage: 'No orders'
  },
  noOrdersDescription: {
    id: 'orders.list.empty.description',
    defaultMessage: 'No orders have been created.'
  },
  noApprovalRequests: {
    id: 'orders.approval.no-requests',
    defaultMessage:
      'We were unable to find any approval requests for this order.'
  },
  creatingApprovalRequest: {
    id: 'orders.approval.creating',
    defaultMessage: 'Creating approval request'
  },
  approvalTitle: {
    id: 'orders.approval.title',
    defaultMessage: 'Summary'
  },
  approvalDetail: {
    id: 'orders.approval.view-detail',
    // eslint-disable-next-line quotes
    defaultMessage: "View this order's approval request details"
  },
  approvalCreated: {
    id: 'orders.approval.details.created',
    defaultMessage: 'Request created'
  },
  approvalReason: {
    id: 'orders.approval.details.reason',
    defaultMessage: 'Approval reason'
  },
  approvalCompleted: {
    id: 'orders.approval.details.completed',
    defaultMessage: 'Completed at'
  },
  orderDetails: {
    id: 'orders.common.details',
    defaultMessage: 'Order details'
  },
  menuApproval: {
    id: 'orders.menu.approval',
    defaultMessage: 'Approval'
  },
  menuProvision: {
    id: 'orders.menu.provision',
    defaultMessage: 'Provision'
  },
  menuLifecycle: {
    id: 'orders.menu.lifecycle',
    defaultMessage: 'Lifecycle'
  },
  menuSteps: {
    id: 'orders.menu.steps',
    defaultMessage: 'Order steps'
  },
  objectsNotFound: {
    id: 'order.detail.not-found',
    defaultMessage:
      'The {objects} for this order {count, plural, one {is} other {are}} not available'
  },
  orderID: {
    id: 'orders.order.detail.ID',
    defaultMessage: 'Order ID'
  },
  orderParameters: {
    id: 'orders.order.detail.parameters',
    defaultMessage: 'Order parameters'
  },
  orderItemParameters: {
    id: 'orders.order.provision.parameters',
    defaultMessage: 'Parameters'
  },
  defaultOrderItemType: {
    id: 'orders.order.default_type',
    defaultMessage: 'Product'
  },
  orderProgressMessages: {
    id: 'orders.order.detail.messages',
    defaultMessage: 'Progress messages'
  },
  lifecycleLink: {
    id: 'orders.order.lifecycle.link',
    defaultMessage: 'Manage product'
  },
  cancelOrder: {
    id: 'orders.actions.cancel',
    defaultMessage: 'Cancel order'
  },
  reOrder: {
    id: 'orders.actions.reorder',
    defaultMessage: 'Reorder'
  },
  keepOrder: {
    id: 'orders.actions.keep',
    defaultMessage: 'Keep order'
  },
  cancelDescription: {
    id: 'orders.cancel.description',
    defaultMessage: 'Are you sure you want to cancel {name}?'
  },
  backToOrders: {
    id: 'orders.toolbar.backLink',
    defaultMessage: 'Back to orders'
  },
  orderDate: {
    id: 'orders.approval.order-date',
    defaultMessage: 'Order date'
  },
  approvalParameters: {
    id: 'orders.approval.parameters',
    defaultMessage: 'Parameters'
  },
  activity: {
    id: 'orders.approval.activity',
    defaultMessage: 'Activity'
  },
  artifacts: {
    id: 'orders.artifacts',
    defaultMessage: 'Order artifacts'
  },
  noOrderProvision: {
    id: 'orders.provision.no-items',
    defaultMessage: 'We were unable to find provisioning data for this order.'
  },
  fetchingOrderProvision: {
    id: 'orders.provision.fetching-provision',
    defaultMessage: 'Retrieving order provisioning data'
  },
  title: {
    id: 'orders.title',
    defaultMessage: 'Orders'
  }
});

export default ordersMessages;
