import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Section } from '@red-hat-insights/insights-frontend-components';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  Dropdown,
  DropdownPosition,
  DropdownItem,
  KebabToggle,
  Title,
  Button
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import ContentGallery from '../../SmartComponents/ContentGallery/ContentGallery';
import { fetchSelectedPortfolio, fetchPortfolioItemsWithPortfolio } from '../../Store/Actions/PortfolioActions';
import MainModal from '../Common/MainModal';
import { hideModal, showModal } from '../../Store/Actions/MainModalActions';
import MainModal from '../Common/MainModal';
import AddProductsToPortfolio from '../../SmartComponents/Portfolio/AddProductsToPortfolio';
import PortfolioFilterToolbar from '../../PresentationalComponents/Portfolio/PortfolioFilterToolbar';
import PortfolioActionToolbar from '../../PresentationalComponents/Portfolio/PortfolioActionToolbar';
import './portfolio.scss';

class Portfolio extends Component {
    state = {
      portfolioId: '',
      isKebabOpen: false,
      isOpen: false,
      filteredItems: []
    };

  fetchData = (apiProps) => {
    this.props.fetchSelectedPortfolio(apiProps);
    this.props.fetchPortfolioItemsWithPortfolio(apiProps);
  }

  componentDidMount() {
    this.fetchData(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchData(this.props.match.params.id);
    }
  }

    onClickEditPortfolio = (event) => {
      this.props.showModal({
        open: true,
        itemdata: this.props,
        closeModal: this.props.hideModal
      }, 'editportfolio');

      this.setState({
        ...this.state,
        isOpen: !this.state.isOpen
      });
    };

    onClickAddProducts = (event) => {
      this.setViewMode('addproducts');
      //this.props.history.push({ pathname: this.props.location.pathname + `/addproducts`,  state: { title: this.props.portfolio.name }});
    };

    onClickCancelAddProducts = () => {
      this.setViewMode(null);
    };

    filterItems = (filterValue) => {
      let filteredItems = [];
      if (this.props.portfolioItems && this.props.portfolioItems.portfolioItems) {
        filteredItems = this.props.portfolioItems.portfolioItems;
        filteredItems = filteredItems.filter((item) => {
          let itemName = item.name.toLowerCase();
          return itemName.indexOf(
            filterValue.toLowerCase()) !== -1;
        });
      }

      return filteredItems;
    };

    setViewMode = (mode = null, reloadData = false) => {
      this.setState({
        ...this.state,
        viewMode: mode
      });
      if (reloadData) {
        this.props.fetchPortfolioItemsWithPortfolio(this.props.match.params.id);
      }
    };

    render() {
      if (this.state.viewMode === 'addproducts') {
        return (
          <AddProductsToPortfolio
            resetViewMode={ this.setViewMode }
            onClickCancelAddProducts={ this.onClickCancelAddProducts }
            portfolio={ this.props.portfolio } />
        );
      }
      else {
        let filteredItems = {
          items: this.props.portfolioItems.portfolioItems,
          isLoading: this.props.isLoading
        };
        let title = this.props.portfolio ? this.props.portfolio.name : '';
        return (
          <Section>
            <PortfolioFilterToolbar/>
            { (!this.props.isLoading) &&
                    <div style={ { marginTop: '15px', marginLeft: '25px', marginRight: '25px' } }>
                      <PortfolioActionToolbar title={ title }
                        onClickEditPortfolio={ this.onClickEditPortfolio }
                        onClickAddProducts={ this.onClickAddProducts }
                        onAddToPortfolio={ this.onAddToPortfolio }
                        filterItems={ this.filterItems }/>
                    </div> }
            <ContentGallery { ...filteredItems } />
            <MainModal/>
          </Section>
        );
      }
    }
}

const mapStateToProps = state => ({
  portfolio: state.PortfolioStore.selectedPortfolio,
  portfolioItems: state.PortfolioStore.portfolioItems,
  isLoading: state.PortfolioStore.isLoading
});

const mapDispatchToProps = dispatch => ({
  fetchPortfolioItemsWithPortfolio: apiProps => dispatch(fetchPortfolioItemsWithPortfolio(apiProps)),
  fetchSelectedPortfolio: apiProps => dispatch(fetchSelectedPortfolio(apiProps)),
  hideModal: () => dispatch(hideModal()),
  showModal: (modalProps, modalType) => {
    dispatch(showModal({ modalProps, modalType }));
  }
});

Portfolio.propTypes = {
  isLoading: propTypes.bool,
  fetchPortfolioItemsWithPortfolio: propTypes.func,
  fetchSelectedPortfolio: propTypes.func,
  showModal: propTypes.func,
  hideModal: propTypes.func,
  history: propTypes.object,
  onClickEditPortfolio: propTypes.func
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Portfolio));
