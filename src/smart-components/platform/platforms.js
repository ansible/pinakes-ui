import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { Section } from '@redhat-cloud-services/frontend-components';
import {
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';

import Platform from './platform';
import { scrollToTop } from '../../helpers/shared/helpers';
import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import ContentGallery from '../content-gallery/content-gallery';
import { fetchPlatforms } from '../../redux/actions/platform-actions';
import PlatformCard from '../../presentational-components/platform/platform-card';
import createPlatformsToolbarSchema from '../../toolbar/schemas/platforms-toolbar.schema';
import ContentGalleryEmptyState from '../../presentational-components/shared/content-gallery-empty-state';

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

    renderEmptyStateDescription = () => (
      <Fragment>
        <TextContent>
          <Text component={ TextVariants.p }>
            Configure a source in order to add products to portfolios.
          </Text>
          <Text component={ TextVariants.p }>
            To connect to a source, go to <a href={ `${document.baseURI}ansible/settings/sources` }>Catalog sources</a>&nbsp;
            under Settings
          </Text>
          <Text component={ TextVariants.p }>
            <a href="javascript:void(0)">Learn more in the documentation</a>
          </Text>
        </TextContent>
      </Fragment>
    )

    renderPlatforms = () => {
      const filteredItems = {
        items: this.props.platforms
        .filter(({ name }) => name.toLowerCase().includes(this.state.filterValue.toLowerCase()))
        .map((item) => <PlatformCard key={ item.id } { ...item } />),
        isLoading: this.props.isLoading && this.props.platforms.length === 0
      };
      return (
        <Fragment>
          <ToolbarRenderer schema={ createPlatformsToolbarSchema({
            onFilterChange: this.handleFilterChange,
            searchValue: this.state.filterValue,
            title: 'Platforms'
          }) }/>
          <ContentGallery
            { ...filteredItems }
            renderEmptyState={ () => (
              <ContentGalleryEmptyState
                title="No platforms yet"
                renderDescription={ this.renderEmptyStateDescription }
                Icon={ SearchIcon }
              />
            ) }
          />
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
