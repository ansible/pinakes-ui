import React from 'react';
import './content-gallery.scss';
import propTypes from 'prop-types';
import { Section } from '@red-hat-insights/insights-frontend-components';
import { Grid } from '@patternfly/react-core';

// swap loading?
const ContentGallery = ({ isLoading, items }) => {
  if (isLoading || (items && items.length) > 0) {
    return (
      <div>
        <br />
        <div>
          { isLoading && (<span> Loading...</span>) }
        </div>
        <Section type='content'>
          <Grid gutter='md' >
            { items }
          </Grid>
        </Section>
      </div>
    );
  }
  else if (!isLoading) {
    return (
      <Section type='content'>
        <div>
        </div>
      </Section>
    );
  }
};

ContentGallery.propTypes = {
  isLoading: propTypes.bool,
  items: propTypes.array
};
export default ContentGallery;
