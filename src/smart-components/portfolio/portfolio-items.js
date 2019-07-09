import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import createPortfolioToolbarSchema from '../../toolbar/schemas/portfolio-toolbar.schema';
import AddPortfolioModal from './add-portfolio-modal';
import RemovePortfolioModal from './remove-portfolio-modal';
import SharePortfolioModal from './share-portfolio-modal';
import OrderModal from '../common/order-modal';
import PortfolioEmptyState from './portfolio-empty-state';
import ContentGallery from '../content-gallery/content-gallery';

const PortolioItems = ({
  title,
  filteredItems,
  addProductsRoute,
  editPortfolioRoute,
  sharePortfolioRoute,
  removePortfolioRoute,
  selectedItems,
  filterValue,
  handleFilterChange,
  isLoading,
  copyInProgress,
  removeProducts,
  copyPortfolio,
  portfolioRoute
}) => (
  <Fragment>
    <ToolbarRenderer schema={ createPortfolioToolbarSchema({
      filterProps: {
        searchValue: filterValue,
        onFilterChange: handleFilterChange,
        placeholder: 'Filter by name...'
      },
      title,
      addProductsRoute,
      editPortfolioRoute,
      sharePortfolioRoute,
      removePortfolioRoute,
      copyPortfolio,
      isLoading,
      copyInProgress,
      removeProducts: () => removeProducts(selectedItems),
      itemsSelected: selectedItems.length > 0
    }) } />
    <Route exact path="/portfolios/detail/:id/edit-portfolio" component={ AddPortfolioModal } />
    <Route exact path="/portfolios/detail/:id/remove-portfolio" component={ RemovePortfolioModal } />
    <Route exact path="/portfolios/detail/:id/share-portfolio" component={ SharePortfolioModal } />
    <Route exact path="/portfolios/detail/:id/order/:itemId" render={ props => <OrderModal { ...props } closeUrl={ portfolioRoute } /> } />
    <ContentGallery { ...filteredItems } renderEmptyState={ () => <PortfolioEmptyState /> } />
  </Fragment>
);

PortolioItems.propTypes = {
  title: PropTypes.string.isRequired,
  filteredItems: PropTypes.shape({ items: PropTypes.arrayOf(PropTypes.node), isLoading: PropTypes.bool }),
  portfolioRoute: PropTypes.string.isRequired,
  addProductsRoute: PropTypes.string.isRequired,
  editPortfolioRoute: PropTypes.string.isRequired,
  sharePortfolioRoute: PropTypes.string.isRequired,
  removePortfolioRoute: PropTypes.string.isRequired,
  selectedItems: PropTypes.arrayOf(PropTypes.string),
  filterValue: PropTypes.string.isRequired,
  handleFilterChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  copyInProgress: PropTypes.bool,
  removeProducts: PropTypes.func.isRequired,
  copyPortfolio: PropTypes.func.isRequired

};

export default PortolioItems;
