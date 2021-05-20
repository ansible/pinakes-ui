/* eslint-disable react/prop-types */
import React, { Fragment, ReactNode } from 'react';
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

export interface ContentGalleryProps {
  isLoading?: boolean;
  items?: ReactNode[];
  renderEmptyState?: () => ReactNode;
}
const ContentGallery: React.ComponentType<ContentGalleryProps> = ({
  isLoading,
  items,
  renderEmptyState
}) => (
  <Fragment>
    {isLoading ? (
      <CardLoader />
    ) : items?.length === 0 ? (
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
    )}
  </Fragment>
);

export default ContentGallery;
