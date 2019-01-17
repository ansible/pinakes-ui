import React, { Fragment } from 'react';
import './content-gallery.scss';
import propTypes from 'prop-types';
import { Grid } from '@patternfly/react-core';
import { Section } from '@red-hat-insights/insights-frontend-components';
import { CardLoader } from '../../PresentationalComponents/Shared/LoaderPlaceholders';
import { Bullseye, Text, TextVariants } from '@patternfly/react-core';

const NoItems = () => (
  <Bullseye>
    <Text component={ TextVariants.h1 }>No items found</Text>
  </Bullseye>
);

const ContentGallery = ({ isLoading, items }) => (
  <Fragment>
    { isLoading ? <CardLoader /> : (
      <Section type="content">
        <Grid gutter='md' >
          { items.length > 0 ? items : <NoItems /> }
        </Grid>
      </Section>
    ) }
  </Fragment>
);

ContentGallery.propTypes = {
  isLoading: propTypes.bool,
  items: propTypes.array
};
export default ContentGallery;
