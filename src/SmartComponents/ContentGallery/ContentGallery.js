import React, { Component } from 'react';
import './content-gallery.scss';
import { BarLoader } from 'react-spinners';
import propTypes from 'prop-types';
import { Pagination } from '@red-hat-insights/insights-frontend-components/components/Pagination';
import { PageHeader, PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { Bullseye } from '@patternfly/react-core';

class ContentGallery extends Component {
  render() {
    if ( this.props.isLoading || (this.props.items && this.props.items.length) > 0) {
      return (
        <React.Fragment>
          <br />
          <Bullseye>
            <BarLoader color={'#00b9e4'} loading={this.props.isLoading} />
          </Bullseye>
          <div className="pf-l-grid pf-m-gutter">
            {this.props.items}
          </div>
        </React.Fragment>
      );
    }
    else if (!this.props.isLoading) {
      return (
        <React.Fragment>
          <div>
            <PageHeader>
              <PageHeaderTitle title={'No Catalog Items'}/>
            </PageHeader>
          </div>
         </React.Fragment>
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
