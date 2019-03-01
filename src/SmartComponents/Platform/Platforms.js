import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { Section } from '@red-hat-insights/insights-frontend-components';
import { Text, TextContent, TextVariants, Level, LevelItem } from '@patternfly/react-core';
import ContentGallery from '../../SmartComponents/ContentGallery/ContentGallery';
import PlatformCard from '../../PresentationalComponents/Platform/PlatformCard';
import PlatformToolbar from '../../PresentationalComponents/Platform/PlatformToolbar';
import { fetchPlatforms } from '../../redux/Actions/PlatformActions';
import { scrollToTop } from '../../Helpers/Shared/helpers';
import Platform from './Platform';

const platformsRoutes = {
  platforms: '',
  detail: '/detail/:id'
};

class Platforms extends Component {
    state = {
      filterValue: '',
      isOpen: false
    };

    fetchData = () => this.props.fetchPlatforms();

    componentDidMount() {
      this.fetchData();
      scrollToTop();
    }

    handleFilterChange = filterValue => this.setState({ filterValue })

    renderToolbar() {
      return (
        <Level className="pf-u-pt-md pf-u-pr-xl pf-u-pl-xl">
          <LevelItem>
            <TextContent>
              <Text component={ TextVariants.h2 }>All Platforms </Text>
            </TextContent>
          </LevelItem>
        </Level>
      );
    }

    renderPlatforms = () => {
      const filteredItems = {
        items: this.props.platforms
        .filter(({ name }) => name.toLowerCase().includes(this.state.filterValue.toLowerCase()))
        .map((item) => <PlatformCard key={ item.id } { ...item } />),
        isLoading: this.props.isLoading
      };
      return (
        <Fragment>
          <PlatformToolbar onFilterChange={ this.handleFilterChange } searchValue={ this.state.filterValue } />
          { this.renderToolbar() }
          <ContentGallery { ...filteredItems } />
        </Fragment>
      );
    }

    render() {
      return (
        <Section>
          <Switch>
            <Route path={ `/platforms${platformsRoutes.detail}` } component={ Platform } />
            <Route path={ `/platforms${platformsRoutes.platforms}` } render={ () => this.renderPlatforms() } />
          </Switch>
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
    fetchPlatforms: apiProps => dispatch(fetchPlatforms(apiProps))
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
  fetchPlatforms: propTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Platforms);
