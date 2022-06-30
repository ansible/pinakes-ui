import React, { Fragment, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import createPortfolioToolbarSchema from '../../toolbar/schemas/portfolio-toolbar.schema';
import PortfolioEmptyState from './portfolio-empty-state';
import ContentGallery from '../content-gallery/content-gallery';
import PortfolioItem from './portfolio-item';
import { fetchPortfolioItemsWithPortfolio } from '../../redux/actions/portfolio-actions';
import { fetchPortfolioItemsWithPortfolio as fetchPortfolioItemsWithPortfolioS } from '../../redux/actions/portfolio-actions-s';
import AsyncPagination from '../common/async-pagination';
import BottomPaginationContainer from '../../presentational-components/shared/bottom-pagination-container';
import useQuery from '../../utilities/use-query';
import { PORTFOLIO_ROUTE } from '../../constants/routes';
import filteringMessages from '../../messages/filtering.messages';
import useFormatMessage from '../../utilities/use-format-message';
import UserContext from '../../user-context';
import { hasPermission, isStandalone } from '../../helpers/shared/helpers';
import { defaultSettings } from '../../helpers/shared/pagination';

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
  const {
    data,
    results,
    meta,
    count,
    name,
    description,
    metadata
  } = useSelector(
    ({
      portfolioReducer: {
        portfolioItems: { data, results, meta, count },
        selectedPortfolio: { name, description, metadata }
      }
    }) => ({
      data,
      results,
      meta,
      count,
      name,
      description,
      metadata
    })
  );
  const [limit, setLimit] = useState(defaultSettings.limit);
  const [offset, setOffset] = useState(1);
  const { url } = useRouteMatch(PORTFOLIO_ROUTE);
  const [{ portfolio: id }] = useQuery(['portfolio']);
  const dispatch = useDispatch();
  const { permissions: userPermissions } = useContext(UserContext);
  const canLinkOrderProcesses = hasPermission(userPermissions, [
    'catalog:order_processes:link'
  ]);
  const dataSet = data ? data : results;
  const metaInfo = meta ? meta : { count, limit, offset };

  const userCapabilities = metadata?.user_capabilities;

  const items = dataSet.map((item) => (
    <PortfolioItem
      key={item.id}
      {...item}
      pathname={`${url}/portfolio-item`}
      searchParams={{
        source: item.service_offering_source_ref,
        'portfolio-item': item.id
      }}
      preserveSearch
      isSelectable={userCapabilities?.update}
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
          meta: metaInfo,
          setLimit,
          setOffset,
          fetchPortfolioItemsWithPortfolio: (...args) =>
            dispatch(
              isStandalone()
                ? fetchPortfolioItemsWithPortfolioS(...args)
                : fetchPortfolioItemsWithPortfolio(...args)
            ),
          portfolioId: id,
          userCapabilities,
          canLinkOrderProcesses
        })}
      />
      <ContentGallery
        items={items}
        isLoading={isFetching || isFiltering}
        renderEmptyState={() => (
          <PortfolioEmptyState
            handleFilterChange={handleFilterChange}
            meta={metaInfo}
            userCapabilities={userCapabilities}
            url={routes.addProductsRoute}
          />
        )}
      />
      {metaInfo?.count > 0 && (
        <BottomPaginationContainer>
          <AsyncPagination
            dropDirection="up"
            meta={metaInfo}
            setLimit={setLimit}
            setOffset={setOffset}
            apiProps={id}
            apiRequest={(...args) =>
              dispatch(
                isStandalone()
                  ? fetchPortfolioItemsWithPortfolioS(...args)
                  : fetchPortfolioItemsWithPortfolio(...args)
              )
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
    selectedItems: PropTypes.array,
    filterValue: PropTypes.string
  }).isRequired,
  fromProducts: PropTypes.bool
};

PortfolioItems.defaultProps = {
  state: {
    removeInProgress: false,
    isFetching: false,
    isFiltering: false,
    copyInProgress: false,
    selectedItems: [],
    filterValue: undefined
  }
};

export default PortfolioItems;
