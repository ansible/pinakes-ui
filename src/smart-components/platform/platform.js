import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import debouncePromise from 'awesome-debounce-promise';

import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import ContentGallery from '../content-gallery/content-gallery';
import { scrollToTop, filterServiceOffering } from '../../helpers/shared/helpers';
import PlatformItem from '../../presentational-components/platform/platform-item';
import createPlatformsToolbarSchema from '../../toolbar/schemas/platforms-toolbar.schema';
import { defaultSettings, getCurrentPage, getNewPage } from '../../helpers/shared/pagination';
import { fetchSelectedPlatform, fetchPlatformItems } from '../../redux/actions/platform-actions';

class Platform extends Component {
  state = {
    filterValue: ''
  };

  fetchData(apiProps, pagination) {
    this.props.fetchSelectedPlatform(apiProps);
    this.props.fetchPlatformItems(apiProps, pagination);
  }

  componentDidMount() {
    this.fetchData(this.props.match.params.id, defaultSettings);
    scrollToTop();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchData(this.props.match.params.id, defaultSettings);
      scrollToTop();
    }
  }

  handleOnPerPageSelect = limit => this.props.fetchPlatformItems(this.props.match.params.id, {
    offset: this.props.paginationCurrent.offset,
    limit
  });

  handleSetPage = (number, debounce) => {
    const options = {
      offset: getNewPage(number, this.props.paginationCurrent.limit),
      limit: this.props.paginationCurrent.limit
    };
    const request = () => this.props.fetchPlatformItems(this.props.match.params.id, options);
    if (debounce) {
      return debouncePromise(request, 250)();
    }

    return request();
  }

  handleFilterChange = filterValue => this.setState({ filterValue });

  render() {
    let filteredItems = {
      items: this.props.platformItems
      .filter(item => filterServiceOffering(item, this.state.filterValue))
      .map(data => <PlatformItem key={ data.id } { ...data } />),
      isLoading: this.props.isPlatformDataLoading
    };

    let title = this.props.platform ? this.props.platform.name : '';
    return (
      <Fragment>
        <ToolbarRenderer schema={ createPlatformsToolbarSchema({
          onFilterChange: this.handleFilterChange,
          searchValue: this.state.filterValue,
          title,
          pagination: {
            itemsPerPage: this.props.paginationCurrent.limit,
            numberOfItems: this.props.paginationCurrent.count || 50,
            onPerPageSelect: this.handleOnPerPageSelect,
            page: getCurrentPage(this.props.paginationCurrent.limit, this.props.paginationCurrent.offset),
            onSetPage: this.handleSetPage,
            direction: 'down'
          }
        }) }/>
        <ContentGallery { ...filteredItems }/>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ platformReducer: { selectedPlatform, platformItems, isPlatformDataLoading }}) => {
  const platformItemsData = selectedPlatform && platformItems[selectedPlatform.id];
  return {
    paginationLinks: platformItemsData && platformItemsData.links,
    paginationCurrent: platformItemsData && platformItemsData.meta,
    platform: selectedPlatform,
    platformItems: platformItemsData && platformItemsData.data,
    isPlatformDataLoading: !selectedPlatform || isPlatformDataLoading
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchSelectedPlatform,
  fetchPlatformItems
}, dispatch);

Platform.propTypes = {
  filteredItems: PropTypes.object,
  isPlatformDataLoading: PropTypes.bool,
  match: PropTypes.object,
  fetchPlatformItems: PropTypes.func.isRequired,
  fetchSelectedPlatform: PropTypes.func,
  platform: PropTypes.shape({
    name: PropTypes.string
  }),
  platformItems: PropTypes.array,
  paginationCurrent: PropTypes.shape({
    limit: PropTypes.number.isRequired,
    offset: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired
  })
};

Platform.defaultProps = {
  platformItems: [],
  paginationCurrent: {
    limit: 50
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Platform);
