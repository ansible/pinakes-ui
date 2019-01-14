import React, { Component, Fragment } from 'react';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import ContentGallery from '../../SmartComponents/ContentGallery/ContentGallery';
import { fetchSelectedPortfolio, fetchPortfolioItemsWithPortfolio } from '../../redux/Actions/PortfolioActions';
import MainModal from '../Common/MainModal';
import { hideModal, showModal } from '../../redux/Actions/MainModalActions';
import AddProductsToPortfolio from '../../SmartComponents/Portfolio/AddProductsToPortfolio';
import PortfolioFilterToolbar from '../../PresentationalComponents/Portfolio/PortfolioFilterToolbar';
import PortfolioActionToolbar from '../../PresentationalComponents/Portfolio/PortfolioActionToolbar';
import PortfolioItem from './PortfolioItem';
import NoMatch from '../../PresentationalComponents/Shared/404Route';
import AddPortfolioModal from './add-portfolio-modal';
import RemovePortfolioModal from './remove-portfolio-modal';
import { scrollToTop } from '../../Helpers/Shared/helpers';
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
    scrollToTop();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchData(this.props.match.params.id);
      scrollToTop();
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

  onClickRemovePortfolio = () => {
    this.props.showModal({
      open: true,
      portfolio: this.props.portfolio,
      onSuccess: this.onPortfolioRemoved,
      closeModal: this.props.hideModal
    }, 'removeportfolio');

    this.setState({
      ...this.state,
      isOpen: !this.state.isOpen
    });
  };

  filterItems = (filterValue) => {
    let filteredItems = [];
    if (this.props.portfolioItems && this.props.portfolioItems.portfolioItems) {
      filteredItems = this.props.portfolioItems.portfolioItems;
      filteredItems = filteredItems.filter(({ name }) => name.toLowerCase().includes(filterValue.toLowerCase()));
    }

    return filteredItems;
  };

  renderProducts = ({ title, filteredItems, addProductsRoute, editPortfolioRoute, removePortfolioRoute }) => (
    <Fragment>
      <PortfolioFilterToolbar/>
      { (!this.props.isLoading) &&
        <div style={ { marginTop: '15px', marginLeft: '25px', marginRight: '25px' } }>
          <PortfolioActionToolbar title={ title }
            onClickEditPortfolio={ this.onClickEditPortfolio }
            onClickRemovePortfolio={ this.onClickRemovePortfolio }
            filterItems={ this.filterItems }
            addProductsRoute={ addProductsRoute }
            editPortfolioRoute={ editPortfolioRoute }
            removePortfolioRoute={ removePortfolioRoute }
          />
        </div>
      }
      <Route exact path="/portfolio/:id/edit-portfolio" component={ AddPortfolioModal } />
      <Route exact path="/portfolio/:id/remove-portfolio" component={ RemovePortfolioModal } />
      <ContentGallery { ...filteredItems } />
      <MainModal/>
    </Fragment>
  )

  renderAddProducts = ({ portfolioRoute }) => (
    <AddProductsToPortfolio
      portfolio={ this.props.portfolio }
      portfolioRoute={ portfolioRoute }
    />
  );

  render() {
    const portfolioRoute = this.props.match.url;
    const addProductsRoute = `${this.props.match.url}/add-products`;
    const editPortfolioRoute = `${this.props.match.url}/edit-portfolio`;
    const removePortfolioRoute = `${this.props.match.url}/remove-portfolio`;
    let filteredItems = {
      items: this.props.portfolioItems.map(item => <PortfolioItem key={ item.id } { ...item }/>),
      isLoading: this.props.isLoading
    };

    let title = this.props.portfolio ? this.props.portfolio.name : '';

    if (this.state.portfolioRemoved) {
      return <Redirect to="/portfolios" />;
    }

    return (
      <Switch>
        <Route path="/portfolio/:id/add-products" render={ props => this.renderAddProducts({ portfolioRoute, ...props }) } />
        <Route
          path="/portfolio/:id"
          render={ props => this.renderProducts({ addProductsRoute, editPortfolioRoute, removePortfolioRoute, filteredItems, title, ...props }) }
        />
        <Route component={ NoMatch } />
      </Switch>
    );
  }
}

const mapStateToProps = ({ portfolioReducer: { selectedPortfolio, portfolioItems, isLoading }}) => ({
  portfolio: selectedPortfolio,
  portfolioItems,
  isLoading: !selectedPortfolio || isLoading
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
  onClickEditPortfolio: propTypes.func.isRequired,
  onClickRemovePortfolio: propTypes.func.isRequired,
  match: propTypes.object,
  portfolio: propTypes.shape({
    name: propTypes.string,
    id: propTypes.string.isRequired
  }),
  portfolioItems: propTypes.array
};

Portfolio.defaultProps = {
  portfolioItems: []
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Portfolio));
