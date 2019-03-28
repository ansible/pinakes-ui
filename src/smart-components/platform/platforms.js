import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { Section } from '@red-hat-insights/insights-frontend-components';
import ContentGallery from '../content-gallery/content-gallery';
import PlatformCard from '../../presentational-components/platform/platform-card';
import PlatformToolbar from '../../presentational-components/platform/platform-toolbar';
import { fetchPlatforms } from '../../redux/actions/platform-actions';
import { scrollToTop } from '../../helpers/shared/helpers';
import Platform from './platform';

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
        isLoading: this.props.isLoading && this.props.platforms.length === 0
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

const mapStateToProps = ({ platformReducer: { platforms, isPlatformDataLoading, filterValue }}) => ({
  platforms,
  isLoading: isPlatformDataLoading,
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
