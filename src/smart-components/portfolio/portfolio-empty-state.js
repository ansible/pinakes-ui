import React from 'react';
import PropTypes from 'prop-types';
import { SearchIcon, PlusCircleIcon } from '@patternfly/react-icons';

import ContentGalleryEmptyState, {
  EmptyStatePrimaryAction
} from '../../presentational-components/shared/content-gallery-empty-state';
import { Button } from '@patternfly/react-core';
import filteringMessages from '../../messages/filtering.messages';
import portfolioMessages from '../../messages/portfolio.messages';
import useFormatMessage from '../../utilities/use-format-message';

const PortfolioEmptyState = ({
  url,
  handleFilterChange,
  meta,
  userCapabilities
}) => {
  const formatMessage = useFormatMessage();
  const NoDataAction = () => (
    <EmptyStatePrimaryAction
      url={url}
      label={formatMessage(portfolioMessages.addProducts)}
      id="add-products-to-portfolio"
      hasPermission={userCapabilities?.update}
    />
  );

  const FilterAction = () => (
    <Button
      id="clear-portfolio-filter"
      ouiaId="clear-portfolio-filter"
      variant="link"
      onClick={() => handleFilterChange('')}
    >
      {formatMessage(filteringMessages.clearFilters)}
    </Button>
  );

  const emptyStateProps = {
    PrimaryAction: meta?.noData ? NoDataAction : FilterAction,
    title: meta?.noData
      ? formatMessage(filteringMessages.noProducts)
      : formatMessage(filteringMessages.noResults),
    description: meta?.noData
      ? formatMessage(portfolioMessages.emptyNoProducts)
      : formatMessage(filteringMessages.noResultsDescription),
    Icon: meta?.noData ? PlusCircleIcon : SearchIcon
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
