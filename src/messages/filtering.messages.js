const { defineMessages } = require('react-intl');

const filteringMessages = defineMessages({
  noItems: {
    id: 'common.filtering.noItems',
    defaultMessage: 'No items found'
  },
  filterByProduct: {
    id: 'common.filtering.filterByProduct',
    defaultMessage: 'Filter by product'
  },
  noResults: {
    id: 'common.filtering.noResults',
    defaultMessage: 'No results found'
  },
  noResultsDescription: {
    id: 'common.filtering.noResultsDescription',
    defaultMessage:
      'No results match the filter criteria. Remove all filters or clear all filters to show results.'
  },
  clearFilters: {
    id: 'common.filtering.clear-filters',
    defaultMessage: 'Clear all filters'
  },
  noProducts: {
    id: 'common.filtering.no-products',
    defaultMessage: 'No products yet'
  }
});

export default filteringMessages;
