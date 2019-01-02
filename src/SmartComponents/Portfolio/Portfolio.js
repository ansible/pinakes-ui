import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Section } from '@red-hat-insights/insights-frontend-components';
import ContentGallery from '../../SmartComponents/ContentGallery/ContentGallery';
import { fetchSelectedPortfolio, fetchPortfolioItemsWithPortfolio } from '../../redux/Actions/PortfolioActions';
import MainModal from '../Common/MainModal';
import { hideModal, showModal } from '../../redux/Actions/MainModalActions';
import AddProductsToPortfolio from '../../SmartComponents/Portfolio/AddProductsToPortfolio';
import PortfolioFilterToolbar from '../../PresentationalComponents/Portfolio/PortfolioFilterToolbar';
import PortfolioActionToolbar from '../../PresentationalComponents/Portfolio/PortfolioActionToolbar';
import PortfolioItem from './PortfolioItem';
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

    onClickEditPortfolio = () => {
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

    onClickAddProducts = () => {
      this.setViewMode('addproducts');
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
          items: this.props.portfolioItems.map(item => <PortfolioItem key={ item.id } { ...item }/>),
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

const mapStateToProps = ({ portfolioReducer: { selectedPortfolio, portfolioItems, isLoading }}) => ({
  portfolio: selectedPortfolio,
  portfolioItems,
  isLoading
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
  onClickEditPortfolio: propTypes.func,
  match: propTypes.object,
  portfolio: propTypes.shape({
    name: propTypes.string
  }),
  portfolioItems: propTypes.array
};

Portfolio.defaultProps = {
  portfolioItems: []
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Portfolio));
