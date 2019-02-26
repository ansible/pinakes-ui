import React, { Component, Fragment } from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import ContentGallery from '../../SmartComponents/ContentGallery/ContentGallery';
import { fetchSelectedPortfolio, fetchPortfolioItemsWithPortfolio } from '../../redux/Actions/PortfolioActions';
import AddProductsToPortfolio from '../../SmartComponents/Portfolio/AddProductsToPortfolio';
import PortfolioFilterToolbar from '../../PresentationalComponents/Portfolio/PortfolioFilterToolbar';
import PortfolioItem from './PortfolioItem';
import AddPortfolioModal from './add-portfolio-modal';
import RemovePortfolioModal from './remove-portfolio-modal';
import { scrollToTop } from '../../Helpers/Shared/helpers';
import RemovePortfolioItems from '../../SmartComponents/Portfolio/RemovePortfolioItems';
import { removePortfolioItems } from '../../Helpers/Portfolio/PortfolioHelper';
import OrderModal from '../Common/OrderModal';
import { filterServiceOffering } from '../../Helpers/Shared/helpers';
import TopToolbar, { TopToolbarTitle } from '../../PresentationalComponents/Shared/top-toolbar';
import PorftolioProduct from '../products/portfolio-product';

import './portfolio.scss';
class Portfolio extends Component {
  state = {
    portfolioId: '',
    filteredItems: [],
    selectedItems: [],
    filterValue: ''
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
    const itemIdsToRemove = this.state.selectedItems;

    this.props.history.goBack();

    removePortfolioItems(itemIdsToRemove).then(() => {
      this.fetchData(this.props.match.params.id);
      this.setState({
        selectedItems: []
      });
    });
  };

  handleItemSelect = selectedItem =>
    this.setState(({ selectedItems }) =>
      selectedItems.includes(selectedItem)
        ? ({ selectedItems: [
          ...selectedItems.slice(0, selectedItems.indexOf(selectedItem)),
          ...selectedItems.slice(selectedItems.indexOf(selectedItem) + 1)
        ]})
        : ({ selectedItems: [ ...selectedItems, selectedItem ]}));

  filterItems = (filterValue) => {
    let filteredItems = [];
    if (this.props.portfolioItems && this.props.portfolioItems.portfolioItems) {
      filteredItems = this.props.portfolioItems.portfolioItems;
      filteredItems = filteredItems.filter(item => filterServiceOffering(item, filterValue));
    }

    return filteredItems;
  };

  handleFilterChange = filterValue => {
    this.setState({ filterValue });
  };

  renderProducts = ({ title, filteredItems, addProductsRoute, removeProductsRoute, editPortfolioRoute, removePortfolioRoute }) => (
    <Fragment>
      <TopToolbar>
        <TopToolbarTitle title={ title }/>
        <PortfolioFilterToolbar
          searchValue={ this.state.filterValue }
          onFilterChange={ this.handleFilterChange }
          addProductsRoute={ addProductsRoute }
          removeProductsRoute={ removeProductsRoute }
          editPortfolioRoute={ editPortfolioRoute }
          removePortfolioRoute={ removePortfolioRoute }
          isLoading={ this.props.isLoading }
        />
      </TopToolbar>
      <Route exact path="/portfolios/detail/:id/edit-portfolio" component={ AddPortfolioModal } />
      <Route exact path="/portfolios/detail/:id/remove-portfolio" component={ RemovePortfolioModal } />
      <Route exact path="/portfolios/detail/:id/order/:itemId" render={ props => <OrderModal { ...props } closeUrl={ this.props.match.url } /> } />
      <ContentGallery { ...filteredItems } />
    </Fragment>
  )

  renderAddProducts = ({ portfolioRoute }) => (
    <AddProductsToPortfolio
      portfolio={ this.props.portfolio }
      portfolioRoute={ portfolioRoute }
    />
  );

  renderRemoveProducts = ({ portfolioRoute, filteredItems, title }) => (
    <React.Fragment>
      <RemovePortfolioItems
        filterValue={ this.state.filterValue }
        onFilterChange={ this.handleFilterChange }
        portfolioName={ title }
        portfolioRoute={ portfolioRoute }
        onRemove={ this.removeProducts }
        disableButton={ this.state.selectedItems.length === 0 }
      />
      <ContentGallery { ...filteredItems } />
    </React.Fragment>
  );

  render() {
    const portfolioRoute = this.props.match.url;
    const addProductsRoute = `${this.props.match.url}/add-products`;
    const removeProductsRoute = `${this.props.match.url}/remove-products`;
    const editPortfolioRoute = `${this.props.match.url}/edit-portfolio`;
    const removePortfolioRoute = `${this.props.match.url}/remove-portfolio`;
    const orderUrl = `${this.props.match.url}/product`;
    const title = this.props.portfolio ? this.props.portfolio.name : '';

    const filteredItems = {
      items: this.props.portfolioItems
      .filter(item => filterServiceOffering(item, this.state.filterValue))
      .map(item => (
        <PortfolioItem
          key={ item.id }
          { ...item }
          isSelectable={ this.props.location.pathname.includes('/remove-products') }
          onSelect={ this.handleItemSelect }
          isSelected={ this.state.selectedItems.includes(item.id) }
          orderUrl={ `${orderUrl}/${item.id}` }
        />
      )),
      isLoading: this.props.isLoading && this.props.portfolioItems.length === 0
    };

    return (
      <Switch>
        <Route path={ addProductsRoute } render={ props => this.renderAddProducts({ portfolioRoute, ...props }) } />
        <Route path={ `${orderUrl}/:productId` } component={ PorftolioProduct }/>
        <Route
          path={ removeProductsRoute }
          render={ props => this.renderRemoveProducts({ filteredItems, portfolioRoute, title, ...props }) }
        />
        <Route
          path={ portfolioRoute }
          render={ props => this.renderProducts(
            { addProductsRoute, removeProductsRoute, editPortfolioRoute, removePortfolioRoute, filteredItems, title, ...props }) }
        />
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
  fetchSelectedPortfolio: apiProps => dispatch(fetchSelectedPortfolio(apiProps))
});

Portfolio.propTypes = {
  isLoading: propTypes.bool,
  fetchPortfolioItemsWithPortfolio: propTypes.func,
  fetchSelectedPortfolio: propTypes.func,
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
