import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { Section } from '@red-hat-insights/insights-frontend-components';
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

    renderPlatforms = () => {
      const filteredItems = {
        items: this.props.platforms
        .filter(({ name }) => name.toLowerCase().includes(this.state.filterValue.toLowerCase()))
        .map((item) => <PlatformCard key={ item.id } { ...item } />),
        isLoading: this.props.isLoading
      };
      return (
        <Fragment>
          <PlatformToolbar onFilterChange={ this.handleFilterChange } searchValue={ this.state.filterValue } title="Platforms" />
          <ContentGallery { ...filteredItems } />
        </Fragment>
      );
    }

    render() {
      return (
        <Section>
          <Switch>
            <Route path={ `/platforms${platformsRoutes.detail}` } component={ Platform } />
            <Route exact path={ `/platforms${platformsRoutes.platforms}` } render={ () => this.renderPlatforms() } />
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
  filteredItems: PropTypes.array,
  platforms: PropTypes.array,
  isLoading: PropTypes.bool,
  searchFilter: PropTypes.string,
  showModal: PropTypes.func,
  hideModal: PropTypes.func,
  history: PropTypes.object,
  fetchPlatforms: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Platforms);
