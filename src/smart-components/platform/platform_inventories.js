import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import debouncePromise from 'awesome-debounce-promise';

import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import ContentGallery from '../content-gallery/content-gallery';
import { scrollToTop, filterPlatformInventories } from '../../helpers/shared/helpers';
import createPlatformsToolbarSchema from '../../toolbar/schemas/platforms-toolbar.schema';
import { defaultSettings, getCurrentPage, getNewPage } from '../../helpers/shared/pagination';
import { fetchSelectedPlatform, fetchPlatformInventories } from '../../redux/actions/platform-actions';

class PlatformInventories extends Component {
  state = {
    filterValue: ''
  };

  fetchData(apiProps, pagination) {
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
      items: this.props.platformInventories
      .filter(item => filterPlatformInventories(item, this.state.filterValue))
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

const mapStateToProps = ({ platformReducer: { selectedPlatform, platformInventories }}) => {
  return {
    paginationLinks: platformInventories.data && platformInventories.data.links,
    paginationCurrent: platformInventories.data && platformInventories.data.meta,
    platform: selectedPlatform,
    platformInventories: platformInventories.data,
    isPlatformDataLoading: !selectedPlatform || isPlatformInventoriesLoading
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchSelectedPlatform,
  fetchPlatformInventories
}, dispatch);

PlatformInventories.propTypes = {
  filteredItems: PropTypes.object,
  isPlatformDataLoading: PropTypes.bool,
  match: PropTypes.object,
  fetchPlatformInventories: PropTypes.func.isRequired,
  fetchSelectedPlatform: PropTypes.func,
  platform: PropTypes.shape({
    name: PropTypes.string
  }),
  platformInventories: PropTypes.array,
  paginationCurrent: PropTypes.shape({
    limit: PropTypes.number.isRequired,
    offset: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired
  })
};

PlatformInventories.defaultProps = {
  platformItems: [],
  paginationCurrent: {
    limit: 50
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(PlatformInventories);
