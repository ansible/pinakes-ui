import React, { useEffect, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch, Route, Switch } from 'react-router-dom';

import PortfolioItem from './portfolio-item';
import PortfolioItems from './portfolio-items';
import { scrollToTop } from '../../helpers/shared/helpers';
import AddProductsToPortfolio from './add-products-to-portfolio';
import { defaultSettings } from '../../helpers/shared/pagination';
import { toggleArraySelection } from '../../helpers/shared/redux-mutators';
import PortfolioItemDetail from './portfolio-item-detail/portfolio-item-detail';
import { fetchPlatforms } from '../../redux/actions/platform-actions';
import {
  copyPortfolio,
  fetchPortfolios,
  fetchSelectedPortfolio,
  removeProductsFromPortfolio,
  fetchPortfolioItemsWithPortfolio,
  resetSelectedPortfolio
} from '../../redux/actions/portfolio-actions';
import asyncFormValidator from '../../utilities/async-form-validator';

const initialState = {
  selectedItems: [],
  removeInProgress: false,
  filterValue: '',
  copyInProgress: false,
  isFetching: true,
  isFiltering: false
};

const debouncedFilter = asyncFormValidator(
  (value, dispatch, filteringCallback, meta = defaultSettings) => {
    filteringCallback(true);
    dispatch(fetchPortfolioItemsWithPortfolio(value, meta)).then(() =>
      filteringCallback(false)
    );
  },
  1000
);

const porftolioUiReducer = (state, { type, payload }) =>
  ({
    selectItem: {
      ...state,
      selectedItems: toggleArraySelection(state.selectedItems, payload)
    },
    setRemoveInProgress: { ...state, removeInProgress: payload },
    removeSucessfull: { ...state, selectedItems: [], removeInProgress: false },
    setFilterValue: { ...state, filterValue: payload, isFiltering: true },
    setCopyInProgress: { ...state, copyInProgress: payload },
    setIsFetching: { ...state, isFetching: payload },
    setFilteringFlag: { ...state, isFiltering: payload }
  }[type]);

const Portfolio = () => {
  const [
    {
      copyInProgress,
      isFetching,
      filterValue,
      removeInProgress,
      selectedItems,
      isFiltering
    },
    stateDispatch
  ] = useReducer(porftolioUiReducer, initialState);
  const match = useRouteMatch('/portfolios/detail/:id');
  const history = useHistory();
  const dispatch = useDispatch();
  const { portfolio, data, meta } = useSelector(
    ({
      portfolioReducer: {
        selectedPortfolio,
        portfolioItems: { data, meta }
      }
    }) => ({
      portfolio: selectedPortfolio,
      data,
      meta
    })
  );

  const fetchData = (apiProps) => {
    stateDispatch({ type: 'setIsFetching', payload: true });
    Promise.all([
      dispatch(fetchPlatforms()),
      dispatch(fetchSelectedPortfolio(apiProps)),
      dispatch(fetchPortfolioItemsWithPortfolio(apiProps, defaultSettings))
    ])
      .then(() => stateDispatch({ type: 'setIsFetching', payload: false }))
      .catch(() => stateDispatch({ type: 'setIsFetching', payload: false }));
  };

  useEffect(() => {
    fetchData(match.params.id);
    scrollToTop();
    return () => dispatch(resetSelectedPortfolio());
  }, [match.params.id]);

  const handleCopyPortfolio = () => {
    stateDispatch({ type: 'setCopyInProgress', payload: true });
    return dispatch(copyPortfolio(match.params.id))
      .then(({ id }) => history.push(`/portfolios/detail/${id}`))
      .then(() => stateDispatch({ type: 'setCopyInProgress', payload: false }))
      .then(() => dispatch(fetchPortfolios()))
      .catch(() =>
        stateDispatch({ type: 'setCopyInProgress', payload: false })
      );
  };

  const removeProducts = (products) => {
    stateDispatch({ type: 'setRemoveInProgress', payload: true });
    dispatch(removeProductsFromPortfolio(products, portfolio.name))
      .then(() => stateDispatch({ type: 'removeSucessfull' }))
      .catch(() =>
        stateDispatch({ type: 'setRemoveInProgress', payload: false })
      );
  };

  const handleItemSelect = (selectedItem) =>
    stateDispatch({ type: 'selectItem', payload: selectedItem });

  const handleFilterChange = (filter) => {
    stateDispatch({ type: 'setFilterValue', payload: filter });
    debouncedFilter(
      portfolio.id,
      dispatch,
      (isFiltering) =>
        stateDispatch({ type: 'setFilteringFlag', payload: isFiltering }),
      {
        ...meta,
        offset: 0,
        filter
      }
    );
  };

  const routes = {
    portfolioRoute: match.url,
    addProductsRoute: `${match.url}/add-products`,
    editPortfolioRoute: `${match.url}/edit-portfolio`,
    removePortfolioRoute: `${match.url}/remove-portfolio`,
    sharePortfolioRoute: `${match.url}/share-portfolio`,
    workflowPortfolioRoute: `${match.url}/edit-workflow`,
    orderUrl: `${match.url}/product`
  };

  const title = portfolio ? portfolio.name : '';

  const items = data.map((item) => (
    <PortfolioItem
      key={item.id}
      {...item}
      to={{
        pathname: `${routes.orderUrl}/${item.id}`,
        search: `portfolio=${item.portfolio_id}&source=${item.service_offering_source_ref}`
      }}
      isSelectable
      onSelect={handleItemSelect}
      isSelected={selectedItems.includes(item.id)}
      removeInProgress={removeInProgress}
    />
  ));

  return (
    <Switch>
      <Route
        path={routes.addProductsRoute}
        render={() => (
          <AddProductsToPortfolio
            portfolio={portfolio}
            portfolioRoute={routes.portfolioRoute}
          />
        )}
      />
      <Route
        path={`${routes.orderUrl}/:portfolioItemId`}
        component={PortfolioItemDetail}
      />
      <Route
        path={routes.portfolioRoute}
        render={(args) => (
          <PortfolioItems
            {...routes}
            {...args}
            selectedItems={selectedItems}
            filteredItems={items}
            title={title}
            filterValue={filterValue}
            handleFilterChange={handleFilterChange}
            isLoading={isFetching || isFiltering}
            copyInProgress={copyInProgress}
            removeProducts={removeProducts}
            copyPortfolio={handleCopyPortfolio}
            fetchPortfolioItemsWithPortfolio={(...args) =>
              dispatch(fetchPortfolioItemsWithPortfolio(args))
            }
            portfolio={portfolio}
            pagination={meta}
          />
        )}
      />
    </Switch>
  );
};

export default Portfolio;
