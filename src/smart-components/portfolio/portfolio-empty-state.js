import React from 'react';
import PropTypes from 'prop-types';
import { SearchIcon, WrenchIcon } from '@patternfly/react-icons';

import ContentGalleryEmptyState, {
  EmptyStatePrimaryAction
} from '../../presentational-components/shared/content-gallery-empty-state';
import { Button } from '@patternfly/react-core';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  addProducts: {
    id: 'portfolio.empty.add.products',
    defaultMessage: 'Add products'
  },
  clear: {
    id: 'portfolio.empty.filters.clear',
    defaultMessage: 'Clear all filters'
  },
  noProducts: {
    id: 'portfolio.empty.filters.no-products',
    defaultMessage: 'No products yet'
  },
  noResults: {
    id: 'portfolio.empty.filters.no-results',
    defaultMessage: 'No results found'
  },
  emptyNoProducts: {
    id: 'portfolio.empty.no-products',
    defaultMessage: 'No products in your portfolio'
  },
  emptyNoResults: {
    id: 'portfolio.empty.no-results',
    defaultMessage:
      'No results match the filter criteria. Remove all filters or clear all filters to show results.'
  }
});

const PortfolioEmptyState = ({
  url,
  handleFilterChange,
  meta,
  userCapabilities: { update }
}) => {
  const { formatMessage } = useIntl();
  const NoDataAction = () => (
    <EmptyStatePrimaryAction
      url={url}
      label={formatMessage(messages.addProducts)}
      id="add-products-to-portfolio"
      hasPermission={update}
    />
  );

  const FilterAction = () => (
    <Button
      id="clear-portfolio-filter"
      variant="link"
      onClick={() => handleFilterChange('')}
    >
      {formatMessage(messages.clear)}
    </Button>
  );

  const emptyStateProps = {
    PrimaryAction: meta.noData ? NoDataAction : FilterAction,
    title: meta.noData
      ? formatMessage(messages.noProducts)
      : formatMessage(messages.noResults),
    description: meta.noData
      ? formatMessage(messages.emptyNoProducts)
      : formatMessage(messages.emptyNoResults),
    Icon: meta.noData ? WrenchIcon : SearchIcon
  };
  return <ContentGalleryEmptyState {...emptyStateProps} />;
};

PortfolioEmptyState.propTypes = {
  url: PropTypes.string.isRequired,
  handleFilterChange: PropTypes.func.isRequired,
  meta: PropTypes.shape({
    noData: PropTypes.bool
  }).isRequired,
  userCapabilities: PropTypes.shape({
    update: PropTypes.bool
  }).isRequired
};

export default PortfolioEmptyState;
