const { defineMessages } = require('react-intl');

const productsMessages = defineMessages({
  addSource: {
    id: 'products.empty.add-source',
    defaultMessage: 'Add source'
  },
  configureSource: {
    id: 'products.empty.configure-source',
    defaultMessage: 'Configure a source and add products into portfolios.'
  },
  title: {
    id: 'products.toolbar.title',
    defaultMessage: 'Products'
  }
});

export default productsMessages;
