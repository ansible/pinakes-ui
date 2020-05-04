import React, { Fragment, useEffect, useReducer, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, useRouteMatch } from 'react-router-dom';
import { SearchIcon, WrenchIcon } from '@patternfly/react-icons';
import { Button } from '@patternfly/react-core';

import AddPortfolio from './add-portfolio-modal';
import SharePortfolio from './share-portfolio-modal';
import RemovePortfolio from './remove-portfolio-modal';
import EditApprovalWorkflow from '../../smart-components/common/edit-approval-workflow';
import { scrollToTop } from '../../helpers/shared/helpers';
import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import ContentGallery from '../content-gallery/content-gallery';
import { defaultSettings } from '../../helpers/shared/pagination';
import { fetchPortfoliosWithState } from '../../redux/actions/portfolio-actions';
import PortfolioCard from '../../presentational-components/portfolio/porfolio-card';
import createPortfolioToolbarSchema from '../../toolbar/schemas/portfolios-toolbar.schema';
import ContentGalleryEmptyState, {
  EmptyStatePrimaryAction
} from '../../presentational-components/shared/content-gallery-empty-state';
import asyncFormValidator from '../../utilities/async-form-validator';
import { PORTFOLIO_RESOURCE_TYPE } from '../../utilities/constants';
import AsyncPagination from '../common/async-pagination';
import BottomPaginationContainer from '../../presentational-components/shared/bottom-pagination-container';
import {
  PORTFOLIOS_ROUTE,
  ADD_PORTFOLIO_ROUTE,
  EDIT_PORTFOLIO_ROUTE,
  REMOVE_PORTFOLIO_ROUTE,
  SHARE_PORTFOLIO_ROUTE,
  WORKFLOW_PORTFOLIO_ROUTE
} from '../../constants/routes';
import UserContext from '../../user-context';
import { hasPermission } from '../../helpers/shared/helpers';
import useInitialUriHash from '../../routing/use-initial-uri-hash';

const debouncedFilter = asyncFormValidator(
  (filter, dispatch, filteringCallback, meta = defaultSettings) => {
    filteringCallback(true);
    dispatch(fetchPortfoliosWithState({ ...meta, filter })).then(() =>
      filteringCallback(false)
    );
  },
  1000
);

const initialState = {
  filterValue: '',
  isOpen: false,
  isFetching: true,
  isFiltering: false
};

const portfoliosState = (state, action) => {
  switch (action.type) {
    case 'setFetching':
      return { ...state, isFetching: action.payload };
    case 'setFilterValue':
      return { ...state, filterValue: action.payload };
    case 'setFilteringFlag':
      return { ...state, isFiltering: action.payload };
  }

  return state;
};

const Portfolios = () => {
  const viewState = useInitialUriHash();
  const [{ filterValue, isFetching, isFiltering }, stateDispatch] = useReducer(
    portfoliosState,
    {
      ...initialState,
      filterValue: viewState?.portfolio?.filter || ''
    }
  );
  const { data, meta } = useSelector(
    ({ portfolioReducer: { portfolios } }) => portfolios
  );
  const match = useRouteMatch(PORTFOLIOS_ROUTE);
  const dispatch = useDispatch();
  const { permissions: userPermissions } = useContext(UserContext);

  useEffect(() => {
    dispatch(fetchPortfoliosWithState(viewState?.portfolio)).then(() =>
      stateDispatch({ type: 'setFetching', payload: false })
    );
    scrollToTop();
    insights.chrome.appNavClick({ id: 'portfolios', secondaryNav: true });
  }, []);

  const itemName = (id) =>
    data.find((item) => item.id === id)?.name || 'portfolio';

  const handleFilterItems = (value) => {
    stateDispatch({ type: 'setFilterValue', payload: value });
    debouncedFilter(
      value,
      dispatch,
      (isFiltering) =>
        stateDispatch({ type: 'setFilteringFlag', payload: isFiltering }),
      {
        ...meta,
        offset: 0
      }
    );
  };

  const NoDataAction = () => (
    <EmptyStatePrimaryAction
      url={ADD_PORTFOLIO_ROUTE}
      id="create-portfolio"
      label="Create portfolio"
      hasPermission={hasPermission(userPermissions, [
        'catalog:portfolios:create'
      ])}
    />
  );

  const FilterAction = () => (
    <Button variant="link" onClick={() => handleFilterItems('')}>
      Clear all filters
    </Button>
  );

  const emptyStateProps = {
    PrimaryAction: meta.noData ? NoDataAction : FilterAction,
    title: meta.noData ? 'No portfolios' : 'No results found',
    description: meta.noData
      ? 'No portfolios match your filter criteria.'
      : 'No results match the filter criteria. Remove all filters or clear all filters to show results.',
    Icon: meta.noData ? WrenchIcon : SearchIcon
  };

  const galleryItems = data.map((item) => (
    <PortfolioCard key={item.id} {...item} />
  ));

  return (
    <Fragment>
      <ToolbarRenderer
        schema={createPortfolioToolbarSchema({
          meta,
          userPermissions,
          fetchPortfolios: (_, options) =>
            dispatch(
              fetchPortfoliosWithState({ filter: filterValue, ...options })
            ),
          filterProps: {
            searchValue: filterValue,
            onFilterChange: handleFilterItems,
            placeholder: 'Filter by portfolio'
          }
        })}
      />
      <Route exact path={[ADD_PORTFOLIO_ROUTE, EDIT_PORTFOLIO_ROUTE]}>
        <AddPortfolio
          removeQuery
          viewState={viewState?.portfolio}
          closeTarget={PORTFOLIOS_ROUTE}
        />
      </Route>
      <Route exact path={REMOVE_PORTFOLIO_ROUTE}>
        <RemovePortfolio viewState={viewState?.portfolio} />
      </Route>
      <Route exact path={SHARE_PORTFOLIO_ROUTE}>
        <SharePortfolio
          closeUrl={match.url}
          querySelector="portfolio"
          removeQuery
          viewState={viewState?.portfolio}
          portfolioName={itemName}
        />
      </Route>
      <Route exact path={WORKFLOW_PORTFOLIO_ROUTE}>
        <EditApprovalWorkflow
          pushParam={{ pathname: match.url }}
          objectType={PORTFOLIO_RESOURCE_TYPE}
          objectName={itemName}
          querySelector="portfolio"
          removeQuery
          keepHash
        />
      </Route>
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
              dispatch(
                fetchPortfoliosWithState({ filter: filterValue, ...options })
              )
            }
            dropDirection="up"
          />
        </BottomPaginationContainer>
      )}
    </Fragment>
  );
};

export default Portfolios;
