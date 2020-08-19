import React from 'react';
import PropTypes from 'prop-types';
import { Section } from '@redhat-cloud-services/frontend-components/components/cjs/Section';
import { Text, TextVariants, Gallery } from '@patternfly/react-core';

import { CardLoader } from '../../presentational-components/shared/loader-placeholders';
import filteringMessages from '../../messages/filtering.messages';
import useFormatMessage from '../../utilities/use-format-message';

const NoItems = () => {
  const formatMessage = useFormatMessage();
  return (
    <div>
      <Text component={TextVariants.h1}>
        {formatMessage(filteringMessages.noItems)}
      </Text>
    </div>
  );
};

const ContentGallery = ({ isLoading, items, renderEmptyState }) =>
  isLoading ? (
    <CardLoader />
  ) : items.length === 0 ? (
    renderEmptyState ? (
      renderEmptyState()
    ) : (
      <NoItems />
    )
  ) : (
    <Section type="content">
      <Gallery hasGutter className="content-gallery">
        {items}
      </Gallery>
    </Section>
  );

ContentGallery.propTypes = {
  isLoading: PropTypes.bool,
  items: PropTypes.array,
  renderEmptyState: PropTypes.func
};
export default ContentGallery;
