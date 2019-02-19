import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Section } from '@red-hat-insights/insights-frontend-components';
import { Text, TextContent, TextVariants, Level, LevelItem } from '@patternfly/react-core';
import ContentGallery from '../../SmartComponents/ContentGallery/ContentGallery';
import PlatformCard from '../../PresentationalComponents/Platform/PlatformCard';
import PlatformToolbar from '../../PresentationalComponents/Platform/PlatformToolbar';
import { fetchPlatforms } from '../../redux/Actions/PlatformActions';
import { scrollToTop } from '../../Helpers/Shared/helpers';

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

    render() {
      let filteredItems = {
        items: this.props.platforms
        .filter(({ name }) => name.toLowerCase().includes(this.state.filterValue.toLowerCase()))
        .map((item) => <PlatformCard key={ item.id } { ...item } />),
        isLoading: this.props.isLoading
      };

      return (
        <Section>
          <PlatformToolbar onFilterChange={ this.handleFilterChange } searchValue={ this.state.filterValue } />
          { this.renderToolbar() }
          <ContentGallery { ...filteredItems } />
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

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Platforms)
);
