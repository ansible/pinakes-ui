import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { parse } from 'querystring';
import { Main, Section } from '@red-hat-insights/insights-frontend-components';
import { fetchPlatformItems } from '../../Store/Actions/PlatformActions';
import { Grid, GridItem, Toolbar, ToolbarGroup, ToolbarItem, ToolbarSection } from '@patternfly/react-core';
import ContentGallery from '../../SmartComponents/ContentGallery/ContentGallery';
import MainModal from '../Common/MainModal';
import './platformitems.scss'

class PlatformItems extends Component {
  constructor(props) {
      super(props);
      this.state = {
          showItems: '',
          filteredItems: []
      };
      console.log('PlatformItems props: ', props)
  }

  fetchData(apiProps) {
    this.props.fetchPlatformItems({...apiProps });
  }

  componentDidMount() {
    let filter = this.props.computedMatch.params.filter;
    console.log('PlatformItems filter: ', filter);
    let parsed = parse(filter);
    console.log('PlatformItems parsed filter: ', parsed);
    this.fetchData(parsed);
  }


  renderToolbar() {
    return(
      <Toolbar style={{backgroundColor: '#ffffff', marginLeft: '8px', paddingBottom: '10px', paddingLeft: '20px'}}>
        <ToolbarSection>
          <ToolbarGroup>
            <ToolbarItem>Select Platform</ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarItem>Search</ToolbarItem>
            <ToolbarItem>Sort</ToolbarItem>
          </ToolbarGroup>
        </ToolbarSection>
      </Toolbar>);
  }

  render() {
    let filteredItems = {
        items: this.props.platformItems.platformItems,
        isLoading: this.props.isLoading
    };
    return (
      <Main style={{marginLeft: 0, paddingLeft:0, paddingTop: 0}}>
        <ContentGallery {...filteredItems} />
      <MainModal />
      </Main>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    platformItems: state.PlatformStore.platformItems,
    isLoading: state.PlatformStore.isPlatformDataLoading,
    searchFilter: state.PlatformStore.filterValue
  };
}

const mapDispatchToProps = dispatch => {
    return {
      fetchPlatformItems: apiProps => dispatch(fetchPlatformItems(apiProps)),
      search: value => dispatch(searchPlatormItems(value))
    };
};

PlatformItems.propTypes = {
    filteredItems: propTypes.object,
    portfolios: propTypes.array,
    platforms: propTypes.object,
    isLoading: propTypes.bool,
    searchFilter: propTypes.string,
    history: propTypes.object,
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(PlatformItems)
);
