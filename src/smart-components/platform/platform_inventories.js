import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import debouncePromise from 'awesome-debounce-promise';
import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import { ContentList } from '../../presentational-components/shared/content-list';
import { scrollToTop, filterServiceOffering } from '../../helpers/shared/helpers';
import createPlatformsToolbarSchema from '../../toolbar/schemas/platforms-toolbar.schema';
import { defaultSettings, getCurrentPage, getNewPage } from '../../helpers/shared/pagination';
import { fetchSelectedPlatform, fetchPlatformInventories } from '../../redux/actions/platform-actions';
import AppTabs from './../../presentational-components/shared/app-tabs';

class PlatformInventories extends Component {
  state = {
    filterValue: ''
  };

  tabItems = [{ eventKey: 0, title: 'Templates', name: `/platforms/detail/${this.props.match.params.id}/platform-templates` },
    { eventKey: 1, title: 'Inventories', name: `/platforms/detail/${this.props.match.params.id}/platform-inventories` }];

  fetchData(apiProps, pagination) {
    this.props.fetchSelectedPlatform(apiProps);
    this.props.fetchPlatformInventories(apiProps, pagination);
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

  handleOnPerPageSelect = limit => this.props.fetchPlatformInventories(this.props.match.params.id, {
    offset: this.props.paginationCurrent.offset,
    limit
  });

  handleSetPage = (number, debounce) => {
    const options = {
      offset: getNewPage(number, this.props.paginationCurrent.limit),
      limit: this.props.paginationCurrent.limit
    };
    const request = () => this.props.isInventoriesDataLoading(this.props.match.params.id, options);
    if (debounce) {
      return debouncePromise(request, 250)();
    }

    return request();
  }

  handleFilterChange = filterValue => this.setState({ filterValue });

  render() {
    let filteredItems = {
      items: this.props.platformInventories
      .filter(item => filterServiceOffering(item, this.state.filterValue)),
      isLoading: this.props.isInventoriesDataLoading
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
        <AppTabs tabItems={ this.tabItems }/>
        <ContentList { ...filteredItems }/>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ platformReducer: { selectedPlatform, platformInventories, isInventoriesDataLoading }}) => {
  const platformInventoriesData = selectedPlatform && platformInventories[selectedPlatform.id];
  return {
    paginationLinks: platformInventoriesData && platformInventoriesData.links,
    paginationCurrent: platformInventoriesData && platformInventoriesData.meta,
    platform: selectedPlatform,
    platformInventories: platformInventoriesData && platformInventoriesData.data,
    isInventoriesDataLoading: !selectedPlatform || isInventoriesDataLoading
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchSelectedPlatform,
  fetchPlatformInventories
}, dispatch);

PlatformInventories.propTypes = {
  filteredItems: PropTypes.object,
  isInventoriesDataLoading: PropTypes.bool,
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
    count: PropTypes.number
  })
};

PlatformInventories.defaultProps = {
  platformInventories: [],
  paginationCurrent: {
    offset: 0,
    limit: 50
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(PlatformInventories);
