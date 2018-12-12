import React, { Component } from 'react';
import './content-gallery.scss';
import propTypes from 'prop-types';
import { Section } from '@red-hat-insights/insights-frontend-components';
import { Grid } from '@patternfly/react-core';

// swap loading?
class ContentGallery extends Component {
  render() {
    if (this.props.isLoading || (this.props.items && this.props.items.length) > 0) {
      return (
        <div>
          <br />
          <div>
            { this.props.isLoading && (<span> Loading...</span>) }
          </div>
          <Section type='content'>
            <Grid gutter='md' >
              { this.props.items }
            </Grid>
          </Section>
        </div>
      );
    }
    else if (!this.props.isLoading) {
      return (
        <Section type='content'>
          <div>
          </div>
        </Section>
      );
    }
  }
}

ContentGallery.propTypes = {
  isLoading: propTypes.bool,
  items: propTypes.array,
  page: propTypes.number,
  pages: propTypes.number,
  pageSize: propTypes.number,
  fetchData: propTypes.func
};
export default ContentGallery;
