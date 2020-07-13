const { defineMessages } = require('react-intl');

const ordersMessages = defineMessages({
  orderedBy: {
    id: 'orders.common.orderedBy',
    defaultMessage: 'Ordered by {owner}'
  },
  lastUpdated: {
    id: 'orders.common.lastUpdated',
    defaultMessage: 'Last updated'
  },
  compositeTitle: {
    id: 'orders.common.compositeTitle',
    defaultMessage: '{name} - Order # {id}'
  }
});

export default ordersMessages;
