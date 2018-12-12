import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Main } from '@red-hat-insights/insights-frontend-components';
import { fetchPlatformItems } from '../../Store/Actions/PlatformActions';
import { Toolbar, ToolbarGroup, ToolbarItem, ToolbarSection } from '@patternfly/react-core';
import ContentGallery from '../../SmartComponents/ContentGallery/ContentGallery';
import MainModal from '../Common/MainModal';
import PlatformToolbar from '../../PresentationalComponents/Platform/PlatformToolbar';

import './platformitems.scss';

class PlatformItems extends Component {
  state = {
    showItems: '',
    filteredItems: []
  }

  fetchData(apiProps) {
    this.props.fetchPlatformItems({ ...apiProps });
  }

  componentDidMount() {
    this.fetchData(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchData(this.props.match.params.id);
    }
  }

  render() {
    let filteredItems = {
      items: this.props.platformItems.platformItems,
      isLoading: this.props.isLoading
    };
    return (
      <Main style={ { marginLeft: 0, paddingLeft: 0, paddingTop: 0 } }>
        <PlatformToolbar/>
        <ContentGallery { ...filteredItems } />
        <MainModal />
      </Main>
    );
  }
}

const mapStateToProps = state => ({
  platformItems: state.PlatformStore.platformItems,
  isLoading: state.PlatformStore.isPlatformDataLoading
});

const mapDispatchToProps = dispatch => ({
  fetchPlatformItems: apiProps => dispatch(fetchPlatformItems(apiProps))
});

PlatformItems.propTypes = {
  filteredItems: propTypes.object,
  platforms: propTypes.object,
  isLoading: propTypes.bool,
  history: propTypes.object
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PlatformItems));
