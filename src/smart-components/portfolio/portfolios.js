import React, { Fragment, useEffect, useReducer, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { PlusCircleIcon, SearchIcon } from '@patternfly/react-icons';
import { Button } from '@patternfly/react-core';

import { scrollToTop } from '../../helpers/shared/helpers';
import ContentGallery from '../content-gallery/content-gallery';
import { defaultSettings } from '../../helpers/shared/pagination';
import {
  fetchPortfoliosWithState,
  copyPortfolio
} from '../../redux/actions/portfolio-actions';
import PortfolioCard from '../../presentational-components/portfolio/porfolio-card';
import ContentGalleryEmptyState, {
  EmptyStatePrimaryAction
} from '../../presentational-components/shared/content-gallery-empty-state';
import asyncFormValidator from '../../utilities/async-form-validator';
import AsyncPagination from '../common/async-pagination';
import BottomPaginationContainer from '../../presentational-components/shared/bottom-pagination-container';
import { ADD_PORTFOLIO_ROUTE, PORTFOLIO_ROUTE } from '../../constants/routes';
import UserContext from '../../user-context';
import { hasPermission } from '../../helpers/shared/helpers';
import useInitialUriHash from '../../routing/use-initial-uri-hash';
import filteringMessages from '../../messages/filtering.messages';
import portfolioMessages from '../../messages/portfolio.messages';

import { SortByDirection } from '@patternfly/react-table';
import useIsMounted from '../../utilities/use-is-mounted';
import PortfoliosPrimaryToolbar from './toolbars/portfolios-primary-toolbar';
import TopToolbar, {
  TopToolbarTitle
} from '../../presentational-components/shared/top-toolbar';
import useFormatMessage from '../../utilities/use-format-message';

const debouncedFilter = asyncFormValidator(
  (filters, meta = defaultSettings, dispatch, filteringCallback) => {
    filteringCallback(true);
    dispatch(fetchPortfoliosWithState(filters, meta)).then(() =>
      filteringCallback(false)
    );
  },
  1000
);

const initialState = {
  isOpen: false,
  isFetching: true,
  isFiltering: false,
  filterType: 'name',
  filters: {
    name: '',
    owner: '',
    sort_by: undefined
  },
  sortDirection: SortByDirection.asc
};

const changeFilters = (value, type, filters) => ({
  ...filters,
  [type]: value
});

const portfoliosState = (state, action) => {
  switch (action.type) {
    case 'setFetching':
      return { ...state, isFetching: action.payload };
    case 'setFilterValue':
      return {
        ...state,
        filters: changeFilters(action.payload, state.filterType, state.filters)
      };
    case 'replaceFilterChip':
      return {
        ...state,
        sortDirection: SortByDirection.asc,
        filters: action.payload
      };
    case 'setFilteringFlag':
      return { ...state, isFiltering: action.payload };
    case 'setFilterType':
      return { ...state, filterType: action.payload };
    case 'setSortBy':
      return {
        ...state,
        sortDirection: action.payload,
        filters: !state.filters.sort_by
          ? { ...state.filters, sort_by: 'name' }
          : state.filters
      };
  }

  return state;
};

const Portfolios = () => {
  const formatMessage = useFormatMessage();
  const viewState = useInitialUriHash();
  const isMounted = useIsMounted();
  const [
    { isFetching, isFiltering, filters, filterType, sortDirection },
    stateDispatch
  ] = useReducer(portfoliosState, {
    ...initialState,
    ...viewState?.portfolio
  });
  const { data, meta } = useSelector(
    ({ portfolioReducer: { portfolios } }) => portfolios
  );
  const dispatch = useDispatch();
  const { permissions: userPermissions } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    dispatch(
      fetchPortfoliosWithState(filters, { ...meta, sortDirection })
    ).then(() => stateDispatch({ type: 'setFetching', payload: false }));
    scrollToTop();
    insights.chrome.appNavClick({ id: 'portfolios', secondaryNav: true });
  }, []);

  const handleFilterItems = (value) => {
    stateDispatch({ type: 'setFilterValue', payload: value });
    debouncedFilter(
      { ...filters, [filterType]: value },
      { ...meta, offset: 0, sortDirection },
      dispatch,
      (isFiltering) =>
        stateDispatch({ type: 'setFilteringFlag', payload: isFiltering })
    );
  };

  useEffect(() => {
    if (isMounted && (!isFiltering || !isFetching)) {
      handleFilterItems(filters[filterType]);
    }
  }, [sortDirection]);

  const handleSort = (direction) =>
    stateDispatch({ type: 'setSortBy', payload: direction });

  const handleCopyPortfolio = (id) =>
    dispatch(copyPortfolio(id)).then(({ id }) =>
      history.push({
        pathname: PORTFOLIO_ROUTE,
        search: `?portfolio=${id}`
      })
    );

  const canCreate = hasPermission(userPermissions, [
    'catalog:portfolios:create'
  ]);

  const canLinkOrderProcesses = hasPermission(userPermissions, [
    'catalog:order_processes:link'
  ]);

  const NoDataAction = () => (
    <EmptyStatePrimaryAction
      url={ADD_PORTFOLIO_ROUTE}
      id="create-portfolio"
      label="Create"
      hasPermission={canCreate}
    />
  );
  const FilterAction = () => (
    <Button
      ouiaId={'clear-filter'}
      variant="link"
      onClick={() => handleFilterItems('')}
    >
      {formatMessage(filteringMessages.clearFilters)}
    </Button>
  );

  const emptyStateProps = {
    PrimaryAction: meta.noData ? NoDataAction : FilterAction,
    title: meta.noData
      ? formatMessage(portfolioMessages.portfoliosNoData)
      : formatMessage(filteringMessages.noResults),
    description: meta.noData
      ? formatMessage(portfolioMessages.portfoliosNoDataDescription)
      : formatMessage(filteringMessages.noResultsDescription),
    Icon: meta.noData ? PlusCircleIcon : SearchIcon
  };
  const galleryItems = data.map((item) => (
    <PortfolioCard
      key={item.id}
      ouiaId={`portfolio-${item.id}`}
      {...item}
      canLinkOrderProcesses={canLinkOrderProcesses}
      handleCopyPortfolio={handleCopyPortfolio}
    />
  ));

  return (
    <Fragment>
      <TopToolbar>
        <TopToolbarTitle
          title={formatMessage(portfolioMessages.portfoliosTitle)}
        />
        <PortfoliosPrimaryToolbar
          filters={filters}
          stateDispatch={stateDispatch}
          debouncedFilter={debouncedFilter}
          initialState={initialState}
          meta={meta}
          filterType={filterType}
          handleFilterItems={handleFilterItems}
          sortDirection={sortDirection}
          handleSort={handleSort}
          fetchPortfoliosWithState={fetchPortfoliosWithState}
          isFetching={isFetching}
          isFiltering={isFiltering}
          canCreate={canCreate}
        />
      </TopToolbar>
      <ContentGallery
        items={galleryItems}
        isLoading={isFetching || isFiltering}
        renderEmptyState={() => (
          <ContentGalleryEmptyState {...emptyStateProps} />
        )}
      />
      {meta.count > 0 && (
        <BottomPaginationContainer>
          <AsyncPagination
            meta={meta}
            apiRequest={(_, options) =>
              dispatch(fetchPortfoliosWithState(filters, options))
            }
            dropDirection="up"
          />
        </BottomPaginationContainer>
      )}
    </Fragment>
  );
};

export default Portfolios;
