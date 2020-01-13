import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Route, useRouteMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import createPortfolioToolbarSchema from '../../toolbar/schemas/portfolio-toolbar.schema';
import AddPortfolioModal from './add-portfolio-modal';
import RemovePortfolioModal from './remove-portfolio-modal';
import SharePortfolioModal from './share-portfolio-modal';
import OrderModal from '../common/order-modal';
import PortfolioEmptyState from './portfolio-empty-state';
import ContentGallery from '../content-gallery/content-gallery';
import EditApprovalWorkflow from '../common/edit-approval-workflow';
import { PORTFOLIO_RESOURCE_TYPE } from '../../utilities/constants';
import PortfolioItem from './portfolio-item';
import { fetchPortfolioItemsWithPortfolio } from '../../redux/actions/portfolio-actions';
import AsyncPagination from '../common/async-pagination';
import BottomPaginationContainer from '../../presentational-components/shared/bottom-pagination-container';

const PortfolioItems = ({
  routes,
  handleFilterChange,
  removeProducts,
  copyPortfolio,
  stateDispatch,
  state: {
    removeInProgress,
    isFetching,
    isFiltering,
    copyInProgress,
    selectedItems,
    filterValue
  }
}) => {
  const { data, meta, name } = useSelector(
    ({
      portfolioReducer: {
        portfolioItems: { data, meta },
        selectedPortfolio: { name }
      }
    }) => ({ data, meta, name })
  );
  const match = useRouteMatch('/portfolios/detail/:id');
  const dispatch = useDispatch();

  const items = data.map((item) => (
    <PortfolioItem
      key={item.id}
      {...item}
      to={{
        pathname: `${match.url}/product/${item.id}`,
        search: `portfolio=${item.portfolio_id}&source=${item.service_offering_source_ref}`
      }}
      isSelectable
      onSelect={(selectedItem) =>
        stateDispatch({ type: 'selectItem', payload: selectedItem })
      }
      isSelected={selectedItems.includes(item.id)}
      removeInProgress={removeInProgress}
    />
  ));

  const itemName = () => name || 'portfolio';

  return (
    <Fragment>
      <ToolbarRenderer
        schema={createPortfolioToolbarSchema({
          filterProps: {
            searchValue: filterValue,
            onFilterChange: handleFilterChange,
            placeholder: 'Filter by product...'
          },
          title: name,
          ...routes,
          copyPortfolio,
          isLoading: isFetching || isFiltering,
          copyInProgress,
          removeProducts: () => removeProducts(selectedItems),
          itemsSelected: selectedItems.length > 0,
          meta,
          fetchPortfolioItemsWithPortfolio: (...args) =>
            dispatch(fetchPortfolioItemsWithPortfolio(...args)),
          portfolioId: match.params.id
        })}
      />
      <Route
        exact
        path="/portfolios/detail/:id/edit-portfolio"
        component={AddPortfolioModal}
      />
      <Route
        exact
        path="/portfolios/detail/:id/remove-portfolio"
        component={RemovePortfolioModal}
      />
      <Route
        exact
        path="/portfolios/detail/:id/share-portfolio"
        render={(...args) => (
          <SharePortfolioModal closeUrl={routes.portfolioRoute} {...args} />
        )}
      />
      <Route
        exact
        path="/portfolios/detail/:id/edit-workflow"
        render={(...args) => (
          <EditApprovalWorkflow
            closeUrl={routes.portfolioRoute}
            objectType={PORTFOLIO_RESOURCE_TYPE}
            objectName={itemName}
            {...args}
          />
        )}
      />
      <Route
        exact
        path="/portfolios/detail/:id/order/:itemId"
        render={(props) => (
          <OrderModal {...props} closeUrl={routes.portfolioRoute} />
        )}
      />
      <ContentGallery
        items={items}
        isLoading={isFetching || isFiltering}
        renderEmptyState={() => (
          <PortfolioEmptyState url={routes.addProductsRoute} />
        )}
      />
      {meta.count > 0 && (
        <BottomPaginationContainer>
          <AsyncPagination
            dropDirection="up"
            meta={meta}
            apiProps={match.params.id}
            apiRequest={(...args) =>
              dispatch(fetchPortfolioItemsWithPortfolio(...args))
            }
          />
        </BottomPaginationContainer>
      )}
    </Fragment>
  );
};

PortfolioItems.propTypes = {
  routes: PropTypes.shape({
    addProductsRoute: PropTypes.string.isRequired,
    portfolioRoute: PropTypes.string.isRequired
  }).isRequired,
  handleFilterChange: PropTypes.func.isRequired,
  removeProducts: PropTypes.func.isRequired,
  copyPortfolio: PropTypes.func.isRequired,
  stateDispatch: PropTypes.func.isRequired,
  state: PropTypes.shape({
    removeInProgress: PropTypes.bool,
    isFetching: PropTypes.bool,
    isFiltering: PropTypes.bool,
    copyInProgress: PropTypes.bool,
    selectedItems: PropTypes.arrayOf(PropTypes.string),
    filterValue: PropTypes.string
  }).isRequired
};

export default PortfolioItems;
