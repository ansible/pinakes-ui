import React, { Component } from 'react';
import './content-gallery.scss';
import { BarLoader } from 'react-spinners';
import propTypes from 'prop-types';
import { Section, Pagination, PageHeader, PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { Grid } from '@patternfly/react-core'

class ContentGallery extends Component {
  render() {
    if ( this.props.isLoading || (this.props.items && this.props.items.length) > 0) {
      return (
        <div>
          <br />
          <div>
              <BarLoader color={'#00b9e4'} loading={this.props.isLoading} />
          </div>
          <Section type='content'>
            <Grid gutter='md' >
              {this.props.items}
            </Grid>
          </Section>
        </div>
      );
    }
    else if (!this.props.isLoading) {
      return (
        <Section type='content'>
          <div>
            <PageHeader>
              <PageHeaderTitle title={'No Catalog Items'}/>
            </PageHeader>
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
