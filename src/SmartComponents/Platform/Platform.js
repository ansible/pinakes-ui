import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Title } from '@patternfly/react-core';
import { fetchSelectedPlatform, fetchPlatformItems } from '../../redux/Actions/PlatformActions';
import ContentGallery from '../../SmartComponents/ContentGallery/ContentGallery';
import PlatformToolbar from '../../PresentationalComponents/Platform/PlatformToolbar';
import PlatformItem from '../../PresentationalComponents/Platform/PlatformItem';
import { scrollToTop, filterServiceOffering } from '../../Helpers/Shared/helpers';
import './platform.scss';

class Platform extends Component {
  state = {
    filterValue: ''
  };

  fetchData(apiProps) {
    this.props.fetchSelectedPlatform(apiProps);
    this.props.fetchPlatformItems(apiProps);
  }

  componentDidMount() {
    this.fetchData(this.props.match.params.id);
    scrollToTop();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchData(this.props.match.params.id);
      scrollToTop();
    }
  }

  handleFilterChange = filterValue => this.setState({ filterValue });

  render() {
    let filteredItems = {
      items: this.props.platformItems
      .filter(item => filterServiceOffering(item, this.state.filterValue))
      .map(data => <PlatformItem key={ data.id } { ...data } />),
      isLoading: this.props.isPlatformDataLoading
    };

    let title = this.props.platform ? this.props.platform.name : '';

    return (
      <Fragment>
        <PlatformToolbar searchValue={ this.state.filterValue } onFilterChange={ this.handleFilterChange } title={ title }/>
        <ContentGallery { ...filteredItems }/>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ platformReducer: { selectedPlatform, platformItems, isPlatformDataLoading }}) => ({
  platform: selectedPlatform,
  platformItems: selectedPlatform && platformItems[selectedPlatform.id],
  isPlatformDataLoading: !selectedPlatform || isPlatformDataLoading
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchSelectedPlatform,
  fetchPlatformItems
}, dispatch);

Platform.propTypes = {
  filteredItems: PropTypes.object,
  isPlatformDataLoading: PropTypes.bool,
  match: PropTypes.object,
  fetchPlatformItems: PropTypes.func.isRequired,
  fetchSelectedPlatform: PropTypes.func,
  platform: PropTypes.shape({
    name: PropTypes.string
  }),
  platformItems: PropTypes.array
};

Platform.defaultProps = {
  platformItems: []
};

export default connect(mapStateToProps, mapDispatchToProps)(Platform);
