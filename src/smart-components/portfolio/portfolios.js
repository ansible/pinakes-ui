import React, { Fragment, useEffect, useReducer } from 'react';
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
import { fetchPortfolios } from '../../redux/actions/portfolio-actions';
import PortfolioCard from '../../presentational-components/portfolio/porfolio-card';
import createPortfolioToolbarSchema from '../../toolbar/schemas/portfolios-toolbar.schema';
import ContentGalleryEmptyState, {
  EmptyStatePrimaryAction
} from '../../presentational-components/shared/content-gallery-empty-state';
import asyncFormValidator from '../../utilities/async-form-validator';
import { PORTFOLIO_RESOURCE_TYPE } from '../../utilities/constants';
import AsyncPagination from '../common/async-pagination';
import BottomPaginationContainer from '../../presentational-components/shared/bottom-pagination-container';

const debouncedFilter = asyncFormValidator(
  (filter, dispatch, filteringCallback, meta = defaultSettings) => {
    filteringCallback(true);
    dispatch(fetchPortfolios({ ...meta, filter })).then(() =>
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
  const [{ filterValue, isFetching, isFiltering }, stateDispatch] = useReducer(
    portfoliosState,
    initialState
  );
  const { data, meta } = useSelector(
    ({ portfolioReducer: { portfolios } }) => portfolios
  );
  const match = useRouteMatch('/portfolios');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      fetchPortfolios({ ...defaultSettings, filter: filterValue })
    ).then(() => stateDispatch({ type: 'setFetching', payload: false }));
    scrollToTop();
    insights.chrome.appNavClick({ id: 'portfolios', secondaryNav: true });
  }, []);

  const itemName = (id) => {
    if (data) {
      return data.find((item) => item.id === id).name;
    }

    return `portfolio`;
  };

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
      url="/portfolios/add-portfolio"
      label="Create portfolio"
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
          fetchPortfolios: (_, options) =>
            dispatch(fetchPortfolios({ filter: filterValue, ...options })),
          filterProps: {
            searchValue: filterValue,
            onFilterChange: handleFilterItems,
            placeholder: 'Filter by portfolio...'
          }
        })}
      />
      <Route exact path={['/portfolios/add-portfolio', '/portfolios/edit']}>
        <AddPortfolio removeQuery closeTarget="/portfolios" />
      </Route>
      <Route exact path="/portfolios/remove" component={RemovePortfolio} />
      <Route exact path="/portfolios/share">
        <SharePortfolio closeUrl={match.url} removeQuery />
      </Route>
      <Route
        exact
        path="/portfolios/edit-workflow"
        render={() => (
          <EditApprovalWorkflow
            pushParam={{ pathname: match.url }}
            objectType={PORTFOLIO_RESOURCE_TYPE}
            objectName={itemName}
            querySelector="portfolio"
          />
        )}
      />
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
              dispatch(fetchPortfolios({ filter: filterValue, ...options }))
            }
            dropDirection="up"
          />
        </BottomPaginationContainer>
      )}
    </Fragment>
  );
};

export default Portfolios;
