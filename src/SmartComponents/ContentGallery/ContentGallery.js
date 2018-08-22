import React, { Component } from 'react';
import './content-gallery.scss';
import { BarLoader } from 'react-spinners';
import propTypes from 'prop-types';
import { Pagination } from '@red-hat-insights/insights-frontend-components/components/Pagination';
import { PageHeader, PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { Bullseye } from '@patternfly/react-core';
import SearchBar from 'SmartComponents/ContentGallery/SearchBar';
import { searchCatalogItems } from 'Store/Actions/CatalogItemActions';


class ContentGallery extends Component {
  constructor(props) {
      super(props);
      this.fetchData = this.props.fetchData.bind(this);
  }

  render() {
    if (this.props && this.props.items && this.props.items.length > 0) {
      return (
        <React.Fragment>
          <SearchBar
              searchValue={this.props.searchFilter}
              fetchData={apiProps => this.fetchData(apiProps)}
              searchCallback={input => this.props.searchCatalogItems(input)}
          />
          <br />
          <br />
          <Bullseye>
            <BarLoader color={'#00b9e4'} loading={this.props.isLoading} />
          </Bullseye>
          <div className="pf-l-grid pf-m-gutter">
            {this.props.items}
          </div>
          <div>
            <Pagination
                numberOfItems={this.props.pageSize * this.props.pages}
                page={this.props.page}
                amountOfPages={this.props.pages}
                itemsPerPage={this.props.pageSize}
                onSetPage={page => this.fetchData({ page })}
                onPerPageSelect={page_size => this.fetchData({ page_size })}
            />
            <br />
          </div>
        </React.Fragment>
      );
    }
    else {
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
