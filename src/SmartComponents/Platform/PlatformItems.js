import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Main } from '@red-hat-insights/insights-frontend-components';
import { fetchPlatformItems } from '../../redux/Actions/PlatformActions';
import ContentGallery from '../../SmartComponents/ContentGallery/ContentGallery';
import MainModal from '../Common/MainModal';
import PlatformToolbar from '../../PresentationalComponents/Platform/PlatformToolbar';
import PlatformItem from '../../PresentationalComponents/Platform/PlatformItem';
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
      items: this.props.platformItems.map(data => <PlatformItem key={ data.id } { ...data } />),
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

const mapStateToProps = ({ platformReducer: { platformItems, isPlatformDataLoading }}) => ({
  platformItems,
  isLoading: isPlatformDataLoading
});

const mapDispatchToProps = dispatch => ({
  fetchPlatformItems: apiProps => dispatch(fetchPlatformItems(apiProps))
});

PlatformItems.propTypes = {
  filteredItems: PropTypes.object,
  platforms: PropTypes.object,
  isLoading: PropTypes.bool,
  match: PropTypes.object,
  fetchPlatformItems: PropTypes.func.isRequired,
  platformItems: PropTypes.array
};

PlatformItem.defaultProps = {
  platformItems: []
};

export default connect(mapStateToProps, mapDispatchToProps)(PlatformItems);
