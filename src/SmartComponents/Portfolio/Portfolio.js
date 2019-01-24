import React, { Component, Fragment } from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
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
import RemovePortfolioItems from '../../SmartComponents/Portfolio/RemovePortfolioItems';
import { removePortfolioItems } from '../../Helpers/Portfolio/PortfolioHelper';

class Portfolio extends Component {
  state = {
    portfolioId: '',
    isKebabOpen: false,
    isOpen: false,
    filteredItems: [],
    selectItems: []
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

  removeProducts = () => {
    const itemIdsToRemove = this.state.selectItems;

    this.props.history.goBack();

    removePortfolioItems(itemIdsToRemove).then(() => {
      this.fetchData(this.props.match.params.id);
      this.setState({
        selectItems: []
      });
    });
  };

  handleItemSelect = selectedItem =>
    this.setState(({ selectItems }) =>
      selectItems.includes(selectedItem)
        ? ({ selectItems: [
          ...selectItems.slice(0, selectItems.indexOf(selectedItem)),
          ...selectItems.slice(selectItems.indexOf(selectedItem) + 1)
        ]})
        : ({ selectItems: [ ...selectItems, selectedItem ]}));

  filterItems = (filterValue) => {
    let filteredItems = [];
    if (this.props.portfolioItems && this.props.portfolioItems.portfolioItems) {
      filteredItems = this.props.portfolioItems.portfolioItems;
      filteredItems = filteredItems.filter(({ name }) => name.toLowerCase().includes(filterValue.toLowerCase()));
    }

    return filteredItems;
  };

  renderProducts = ({ title, filteredItems, addProductsRoute, removeProductsRoute, editPortfolioRoute, removePortfolioRoute }) => (
    <Fragment>
      <PortfolioFilterToolbar/>
      { !this.props.isLoading &&
          <PortfolioActionToolbar
            title={ title }
            filterItems={ this.filterItems }
            addProductsRoute={ addProductsRoute }
            removeProductsRoute={ removeProductsRoute }
            editPortfolioRoute={ editPortfolioRoute }
            removePortfolioRoute={ removePortfolioRoute }
          />
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

  renderRemoveProducts = ({ portfolioRoute, filteredItems }) => (
    <React.Fragment>
      <RemovePortfolioItems
        portfolioRoute={ portfolioRoute }
        onRemove={ this.removeProducts } />
      <ContentGallery { ...filteredItems } />
    </React.Fragment>
  );

  render() {
    const portfolioRoute = this.props.match.url;
    const addProductsRoute = `${this.props.match.url}/add-products`;
    const removeProductsRoute = `${this.props.match.url}/remove-products`;
    const editPortfolioRoute = `${this.props.match.url}/edit-portfolio`;
    const removePortfolioRoute = `${this.props.match.url}/remove-portfolio`;
    const title = this.props.portfolio ? this.props.portfolio.name : '';

    const filteredItems = {
      items: this.props.portfolioItems.map(item => (
        <PortfolioItem
          key={ item.id }
          { ...item }
          isSelectable={ this.props.location.pathname.includes('/remove-products') }
          onSelect={ this.handleItemSelect }
          isSelected={ this.state.selectItems.includes(item.id) }
        />
      )),
      isLoading: this.props.isLoading
    };

    return (
      <Switch>
        <Route path="/portfolio/:id/add-products" render={ props => this.renderAddProducts({ portfolioRoute, ...props }) } />
        <Route path="/portfolio/:id/remove-products" render={ props => this.renderRemoveProducts({ filteredItems, portfolioRoute, ...props }) } />
        <Route
          path="/portfolio/:id"
          render={ props => this.renderProducts(
            { addProductsRoute, removeProductsRoute, editPortfolioRoute, removePortfolioRoute, filteredItems, title, ...props }) }
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
  match: propTypes.object,
  portfolio: propTypes.shape({
    name: propTypes.string,
    id: propTypes.string.isRequired
  }),
  location: propTypes.object,
  history: propTypes.object,
  portfolioItems: propTypes.array
};

Portfolio.defaultProps = {
  portfolioItems: []
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Portfolio));
