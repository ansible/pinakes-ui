import React from 'react';
import PropTypes from 'prop-types';
import { SearchIcon, FilterIcon } from '@patternfly/react-icons';

import ContentGallery from '../../content-gallery/content-gallery';
import ContentGalleryEmptyState from '../../../presentational-components/shared/content-gallery-empty-state';
import filteringMessages from '../../../messages/filtering.messages';
import portfolioMessages from '../../../messages/portfolio.messages';
import useFormatMessage from '../../../utilities/use-format-message';

const EmptyState = ({ platform }) => {
  const formatMessage = useFormatMessage();
  return (
    <ContentGalleryEmptyState
      Icon={platform ? SearchIcon : FilterIcon}
      title={
        platform
          ? formatMessage(portfolioMessages.addProducstFilterTitle)
          : formatMessage(portfolioMessages.addProducstPlatformTitle)
      }
      description={
        platform
          ? formatMessage(filteringMessages.noResultsDescription)
          : formatMessage(portfolioMessages.addProducstPlatformDescription)
      }
    />
  );
};

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
