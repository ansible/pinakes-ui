import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Section } from '@red-hat-insights/insights-frontend-components';
import { Toolbar, ToolbarGroup, ToolbarItem, Title } from '@patternfly/react-core';
import ContentGallery from '../../SmartComponents/ContentGallery/ContentGallery';
import PlatformCard from '../../PresentationalComponents/Platform/PlatformCard';
import PlatformToolbar from '../../PresentationalComponents/Platform/PlatformToolbar';
import { fetchPlatformsIfNeeded } from '../../redux/Actions/PlatformActions';
import MainModal from '../Common/MainModal';
import './platform.scss';
import { scrollToTop } from '../../Helpers/Shared/helpers';

class Platforms extends Component {
    state = {
      filteredItems: [],
      isOpen: false
    };

    fetchData = () => {
      this.props.fetchPlatformsIfNeeded();
    };

    componentDidMount() {
      this.fetchData();
      scrollToTop();
    }

    renderToolbar() {
      return (
        <Toolbar>
          <ToolbarGroup>
            <ToolbarItem className={ 'pf-u-ml-sm pf-u-my-sm' } >
              <Title size={ '2xl' }>  All Platforms  </Title>
            </ToolbarItem>
          </ToolbarGroup>
        </Toolbar>
      );
    }

    render() {
      let filteredItems = {
        items: this.props.platforms.map((item) => <PlatformCard key={ item.id } { ...item } />),
        isLoading: this.props.isLoading
      };

      return (
        <Section>
          <PlatformToolbar/>
          <div className="action_toolbar">
            { this.renderToolbar() }
          </div>
          <ContentGallery { ...filteredItems } />
          <MainModal />
        </Section>
      );
    }
}

const mapStateToProps = ({ platformReducer: { platforms, isLoading, filterValue }}) => ({
  platforms,
  isLoading,
  searchFilter: filterValue
});

const mapDispatchToProps = dispatch => {
  return {
    fetchPlatformsIfNeeded: apiProps => dispatch(fetchPlatformsIfNeeded(apiProps))
  };
};

Platforms.propTypes = {
  filteredItems: propTypes.array,
  platforms: propTypes.array,
  isLoading: propTypes.bool,
  searchFilter: propTypes.string,
  showModal: propTypes.func,
  hideModal: propTypes.func,
  history: propTypes.object,
  fetchPlatformsIfNeeded: propTypes.func
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Platforms)
);
