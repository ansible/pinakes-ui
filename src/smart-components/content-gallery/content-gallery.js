import React from 'react';
import PropTypes from 'prop-types';
import { Section } from '@redhat-cloud-services/frontend-components/components/cjs/Section';
import { Text, TextVariants, Gallery } from '@patternfly/react-core';

import { CardLoader } from '../../presentational-components/shared/loader-placeholders';
import { useIntl } from 'react-intl';
import filteringMessages from '../../messages/filtering.messages';

const NoItems = () => {
  const { formatMessage } = useIntl();
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
