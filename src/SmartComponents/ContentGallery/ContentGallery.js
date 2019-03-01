import React from 'react';
import propTypes from 'prop-types';
import { Section } from '@red-hat-insights/insights-frontend-components';
import { CardLoader } from '../../PresentationalComponents/Shared/LoaderPlaceholders';
import { Bullseye, Text, TextVariants } from '@patternfly/react-core';

const NoItems = () => (
  <Bullseye>
    <Text component={ TextVariants.h1 }>No items found</Text>
  </Bullseye>
);

const ContentGallery = ({ isLoading, items }) => isLoading ? <CardLoader /> : (
  <Section type="content">
    <div className="content-gallery" >
      { items.length > 0 ? items : <NoItems /> }
    </div>
  </Section>
);

ContentGallery.propTypes = {
  isLoading: propTypes.bool,
  items: propTypes.array
};
export default ContentGallery;
