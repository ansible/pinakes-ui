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
  },
  noRecords: {
    id: 'commonMessages.noRecords',
    defaultMessage: 'No records'
  },
  filterByTitle: {
    id: 'tableToolbar.filterByTitle',
    defaultMessage: 'Filter by {title}'
  },
  noResultsFound: {
    id: 'tableToolbar.noResultsFound',
    defaultMessage: 'No results found'
  },
  noResult: {
    id: 'tableToolbar.noResult',
    defaultMessage: 'No {results}'
  },
  unknown: {
    id: 'commonMessages.unknown',
    defaultMessage: 'Unknown'
  }
});

export default filteringMessages;
