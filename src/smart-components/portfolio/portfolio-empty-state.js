import React from 'react';
import PropTypes from 'prop-types';
import { SearchIcon, WrenchIcon } from '@patternfly/react-icons';

import ContentGalleryEmptyState, {
  EmptyStatePrimaryAction
} from '../../presentational-components/shared/content-gallery-empty-state';
import { Button } from '@patternfly/react-core';

const PortfolioEmptyState = ({ url, handleFilterChange, meta }) => {
  const NoDataAction = () => (
    <EmptyStatePrimaryAction url={`${url}/add-products`} label="Add products" />
  );

  const FilterAction = () => (
    <Button variant="link" onClick={() => handleFilterChange('')}>
      Clear all filters
    </Button>
  );

  const emptyStateProps = {
    PrimaryAction: meta.noData ? NoDataAction : FilterAction,
    title: meta.noData ? 'No products yet' : 'No results found',
    description: meta.noData
      ? 'No products in your portfolio'
      : 'No results match the filter criteria. Remove all filters or clear all filters to show results.',
    Icon: meta.noData ? WrenchIcon : SearchIcon
  };
  return <ContentGalleryEmptyState {...emptyStateProps} />;
};

PortfolioEmptyState.propTypes = {
  url: PropTypes.string.isRequired,
  handleFilterChange: PropTypes.func.isRequired,
  meta: PropTypes.shape({
    noData: PropTypes.bool
  }).isRequired
};

export default PortfolioEmptyState;
