import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import createPortfolioToolbarSchema from '../../toolbar/schemas/portfolio-toolbar.schema';
import PortfolioEmptyState from './portfolio-empty-state';
import ContentGallery from '../content-gallery/content-gallery';
import PortfolioItem from './portfolio-item';
import { fetchPortfolioItemsWithPortfolio } from '../../redux/actions/portfolio-actions';
import AsyncPagination from '../common/async-pagination';
import BottomPaginationContainer from '../../presentational-components/shared/bottom-pagination-container';
import useQuery from '../../utilities/use-query';
import { PORTFOLIO_ROUTE } from '../../constants/routes';
import filteringMessages from '../../messages/filtering.messages';
import useFormatMessage from '../../utilities/use-format-message';

const PortfolioItems = ({
  routes,
  handleFilterChange,
  removeProducts,
  copyPortfolio,
  stateDispatch,
  fromProducts,
  state: {
    removeInProgress,
    isFetching,
    isFiltering,
    copyInProgress,
    selectedItems,
    filterValue
  }
}) => {
  const formatMessage = useFormatMessage();
  const { data, meta, name, description, userCapabilities } = useSelector(
    ({
      portfolioReducer: {
        portfolioItems: { data, meta },
        selectedPortfolio: {
          name,
          description,
          metadata: { user_capabilities }
        }
      }
    }) => ({
      data,
      meta,
      name,
      description,
      userCapabilities: user_capabilities
    })
  );
  const { url } = useRouteMatch(PORTFOLIO_ROUTE);
  const [{ portfolio: id }] = useQuery(['portfolio']);
  const dispatch = useDispatch();

  const items = data.map((item) => (
    <PortfolioItem
      key={item.id}
      {...item}
      pathname={`${url}/portfolio-item`}
      searchParams={{
        source: item.service_offering_source_ref,
        'portfolio-item': item.id
      }}
      preserveSearch
      isSelectable={userCapabilities.update}
      onSelect={(selectedItem) =>
        stateDispatch({
          type: 'selectItem',
          payload: { selectedItem, product: item }
        })
      }
      isSelected={selectedItems.includes(item.id)}
      removeInProgress={removeInProgress}
    />
  ));

  return (
    <Fragment>
      <ToolbarRenderer
        schema={createPortfolioToolbarSchema({
          fromProducts,
          filterProps: {
            searchValue: filterValue,
            onFilterChange: handleFilterChange,
            placeholder: formatMessage(filteringMessages.filterByProduct)
          },
          title: name,
          description,
          ...routes,
          copyPortfolio,
          isLoading: isFetching || isFiltering,
          copyInProgress,
          removeProducts: () => removeProducts(selectedItems),
          itemsSelected: selectedItems.length > 0,
          meta,
          fetchPortfolioItemsWithPortfolio: (...args) =>
            dispatch(fetchPortfolioItemsWithPortfolio(...args)),
          portfolioId: id,
          userCapabilities
        })}
      />
      <ContentGallery
        items={items}
        isLoading={isFetching || isFiltering}
        renderEmptyState={() => (
          <PortfolioEmptyState
            handleFilterChange={handleFilterChange}
            meta={meta}
            userCapabilities={userCapabilities}
            url={routes.addProductsRoute}
          />
        )}
      />
      {meta.count > 0 && (
        <BottomPaginationContainer>
          <AsyncPagination
            dropDirection="up"
            meta={meta}
            apiProps={id}
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
  }).isRequired,
  fromProducts: PropTypes.bool
};

export default PortfolioItems;
