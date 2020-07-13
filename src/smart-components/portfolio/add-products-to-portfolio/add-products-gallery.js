import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { SearchIcon, FilterIcon } from '@patternfly/react-icons';

import ContentGallery from '../../content-gallery/content-gallery';
import ContentGalleryEmptyState from '../../../presentational-components/shared/content-gallery-empty-state';
import { defineMessages, useIntl } from 'react-intl';
import filteringMessages from '../../../messages/filtering.messages';

const EmptyState = ({ platform }) => {
  const { formatMessage } = useIntl();
  const { current: messages } = useRef(
    defineMessages({
      platformTitle: {
        id: 'portfolio.add.platform.title.empty',
        defaultMessage: 'Please choose platform'
      },
      platformDescription: {
        id: 'portfolio.add.platform.description.empty',
        defaultMessage:
          'In order to select products for your portfolio you must choose platform first'
      },
      filterTitle: {
        id: 'portfolio.add.platform.filter.empty',
        defaultMessage: 'No products match filter parameters'
      }
    })
  );
  return (
    <ContentGalleryEmptyState
      Icon={platform ? SearchIcon : FilterIcon}
      title={
        platform
          ? formatMessage(messages.filterTitle)
          : formatMessage(messages.platformTitle)
      }
      description={
        platform
          ? formatMessage(filteringMessages.noResultsDescription)
          : formatMessage(messages.platformDescription)
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
