import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SearchIcon } from '@patternfly/react-icons';
import { withRouter, Route, Switch } from 'react-router-dom';

import PortfolioItem from './portfolio-item';
import OrderModal from '../common/order-modal';
import AddPortfolioModal from './add-portfolio-modal';
import SharePortfolioModal from './share-portfolio-modal';
import { scrollToTop } from '../../helpers/shared/helpers';
import RemovePortfolioModal from './remove-portfolio-modal';
import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import ContentGallery from '../content-gallery/content-gallery';
import AddProductsToPortfolio from './add-products-to-portfolio';
import { filterServiceOffering } from '../../helpers/shared/helpers';
import PortfolioItemDetail from './portfolio-item-detail/portfolio-item-detail';
import createPortfolioToolbarSchema from '../../toolbar/schemas/portfolio-toolbar.schema';
import ContentGalleryEmptyState, { EmptyStatePrimaryAction } from '../../presentational-components/shared/content-gallery-empty-state';
import {
  copyPortfolio,
  fetchPortfolios,
  fetchSelectedPortfolio,
  removeProductsFromPortfolio,
  fetchPortfolioItemsWithPortfolio
} from '../../redux/actions/portfolio-actions';

class Portfolio extends Component {
  state = {
    portfolioId: '',
    filteredItems: [],
    selectedItems: [],
    filterValue: '',
    isKebabOpen: false,
    copyInProgress: false,
    removeInProgress: false
  };

  handleKebabOpen = isKebabOpen => this.setState({ isKebabOpen });

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

  copyPortfolio = () => {
    this.setState({ copyInProgress: true });
    return this.props.copyPortfolio(this.props.match.params.id)
    .then(({ id }) => this.props.history.push(`/portfolios/detail/${id}`))
    .then(() => this.setState({ copyInProgress: false }))
    .then(() => this.props.fetchPortfolios())
    .catch(() => this.setState({ copyInProgress: false }));
  }

  removeProducts = () => {
    this.setState({ removeInProgress: true });
    this.props.removeProductsFromPortfolio(this.state.selectedItems, this.props.portfolio.name)
    .then(() => this.setState({ selectedItems: [], removeInProgress: false }))
    .catch(() => this.setState({ removeInProgress: false }));
  };

  handleItemSelect = selectedItem =>
    this.setState(({ selectedItems }) =>
      selectedItems.includes(selectedItem)
        ? ({ selectedItems: [
          ...selectedItems.slice(0, selectedItems.indexOf(selectedItem)),
          ...selectedItems.slice(selectedItems.indexOf(selectedItem) + 1)
        ]})
        : ({ selectedItems: [ ...selectedItems, selectedItem ]}));

  filterItems = filterValue => this.props.portfolioItems.filter(item => filterServiceOffering(item, filterValue));

  handleFilterChange = filterValue => {
    this.setState({ filterValue });
  };

  renderEmptyState = () => (
    <ContentGalleryEmptyState
      Icon={ SearchIcon }
      title={ `No products in ${this.props.portfolio.name} portfolio` }
      description="You haven’t added any products to the portfolio"
      PrimaryAction={ () => <EmptyStatePrimaryAction url={ `${this.props.match.url}/add-products` } label="Add products" /> }
    />
  )

  renderProducts = ({
    title,
    filteredItems,
    addProductsRoute,
    editPortfolioRoute,
    sharePortfolioRoute,
    removePortfolioRoute
  }) => (
    <Fragment>
      <ToolbarRenderer schema={ createPortfolioToolbarSchema({
        filterProps: {
          searchValue: this.state.filterValue,
          onFilterChange: this.handleFilterChange,
          placeholder: 'Filter by name...'
        },
        title,
        addProductsRoute,
        editPortfolioRoute,
        sharePortfolioRoute,
        removePortfolioRoute,
        copyPortfolio: this.copyPortfolio,
        isLoading: this.props.isLoading,
        setKebabOpen: this.handleKebabOpen,
        isKebabOpen: this.state.isKebabOpen,
        copyInProgress: this.state.copyInProgress,
        removeProducts: this.removeProducts,
        itemsSelected: this.state.selectedItems.length > 0
      }) } />
      <Route exact path="/portfolios/detail/:id/edit-portfolio" component={ AddPortfolioModal } />
      <Route exact path="/portfolios/detail/:id/remove-portfolio" component={ RemovePortfolioModal } />
      <Route exact path="/portfolios/detail/:id/share-portfolio" component={ SharePortfolioModal } />
      <Route exact path="/portfolios/detail/:id/order/:itemId" render={ props => <OrderModal { ...props } closeUrl={ this.props.match.url } /> } />
      <ContentGallery { ...filteredItems } renderEmptyState={ this.renderEmptyState } />
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
    const sharePortfolioRoute = `${this.props.match.url}/share-portfolio`;
    const orderUrl = `${this.props.match.url}/product`;
    const title = this.props.portfolio ? this.props.portfolio.name : '';

    const filteredItems = {
      items: this.props.portfolioItems
      .filter(item => filterServiceOffering(item, this.state.filterValue))
      .map(item => (
        <PortfolioItem
          key={ item.id }
          { ...item }
          isSelectable
          onSelect={ this.handleItemSelect }
          isSelected={ this.state.selectedItems.includes(item.id) }
          orderUrl={ `${orderUrl}/${item.id}` }
          removeInProgress={ this.state.removeInProgress }
        />
      )),
      isLoading: this.props.isLoading && this.props.portfolioItems.length === 0
    };
    return (
      <Switch>
        <Route path={ addProductsRoute } render={ props => this.renderAddProducts({ portfolioRoute, ...props }) } />
        <Route path={ `${orderUrl}/:portfolioItemId` } component={ PortfolioItemDetail }/>
        <Route
          path={ portfolioRoute }
          render={ props => this.renderProducts(
            { addProductsRoute, editPortfolioRoute,
              removePortfolioRoute, sharePortfolioRoute, filteredItems, title, ...props }) }
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

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchPortfolioItemsWithPortfolio,
  fetchSelectedPortfolio,
  removeProductsFromPortfolio,
  fetchPortfolios,
  copyPortfolio
}, dispatch);

Portfolio.propTypes = {
  isLoading: PropTypes.bool,
  fetchPortfolioItemsWithPortfolio: PropTypes.func,
  fetchSelectedPortfolio: PropTypes.func,
  match: PropTypes.object,
  fetchPortfolios: PropTypes.func.isRequired,
  portfolio: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string.isRequired
  }),
  location: PropTypes.object,
  history: PropTypes.object,
  portfolioItems: PropTypes.array,
  removeProductsFromPortfolio: PropTypes.func.isRequired,
  copyPortfolio: PropTypes.func.isRequired
};

Portfolio.defaultProps = {
  portfolioItems: []
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Portfolio));
