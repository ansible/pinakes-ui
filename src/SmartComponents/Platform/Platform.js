import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Title } from '@patternfly/react-core';
import { fetchSelectedPlatform, fetchPlatformItems } from '../../redux/Actions/PlatformActions';
import ContentGallery from '../../SmartComponents/ContentGallery/ContentGallery';
import PlatformToolbar from '../../PresentationalComponents/Platform/PlatformToolbar';
import PlatformItem from '../../PresentationalComponents/Platform/PlatformItem';
import { scrollToTop } from '../../Helpers/Shared/helpers';
import './platform.scss';

class Platform extends Component {
  state = {
    platformId: '',
    filteredItems: []
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

  render() {
    let filteredItems = {
      items: this.props.platformItems.map(data => <PlatformItem key={ data.id } { ...data } />),
      isLoading: this.props.isPlatformDataLoading
    };

    let title = this.props.platform ? this.props.platform.name : '';

    return (
      <Fragment>
        <PlatformToolbar/>
        <div className="toolbar-padding">
          { title &&  (<Title size={ '2xl' } > { title }</Title>) }
        </div>
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

const mapDispatchToProps = dispatch => ({
  fetchSelectedPlatform: platformId => dispatch(fetchSelectedPlatform(platformId)),
  fetchPlatformItems: apiProps => dispatch(fetchPlatformItems(apiProps))
});

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
