import React from 'react';
import PropTypes from 'prop-types';
import { SearchIcon } from '@patternfly/react-icons';

import ContentGallery from '../../content-gallery/content-gallery';
import ContentGalleryEmptyState from '../../../presentational-components/shared/content-gallery-empty-state';

const EmptyState = ({ platform }) => (
  <ContentGalleryEmptyState
    Icon={SearchIcon}
    title={
      platform
        ? 'No products match filter parameters'
        : 'Please choose platform'
    }
    description={
      platform
        ? 'Please try to extend your search parameters '
        : 'In order to select products for your portfolio you must choose platform first'
    }
  />
);

EmptyState.propTypes = {
  platform: PropTypes.any
};

const AddProductsGallery = ({ platform, ...props }) => (
  <ContentGallery
    editMode={true}
    {...props}
    renderEmptyState={() => <EmptyState platform={platform} />}
  />
);

AddProductsGallery.propTypes = {
  checkedItems: PropTypes.arrayOf(PropTypes.string),
  platform: PropTypes.any
};

AddProductsGallery.defaultProps = {
  checkedItems: []
};

export default AddProductsGallery;
