import React from 'react';
import PropTypes from 'prop-types';
import { SearchIcon } from '@patternfly/react-icons';

import ContentGalleryEmptyState, { EmptyStatePrimaryAction } from '../../presentational-components/shared/content-gallery-empty-state';

const PortfolioEmptyState = ({ name, url }) => (
  <ContentGalleryEmptyState
    Icon={ SearchIcon }
    title={ `No products in ${name} portfolio` }
    description="You haven’t added any products to the portfolio"
    PrimaryAction={ () => <EmptyStatePrimaryAction url={ `${url}/add-products` } label="Add products" /> }
  />
);

PortfolioEmptyState.propTypes = {
  name: PropTypes.string,
  url: PropTypes.string.isRequired
};

export default PortfolioEmptyState;
