import React, { useEffect, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch, Route, Switch } from 'react-router-dom';

import PortfolioItems from './portfolio-items';
import { scrollToTop } from '../../helpers/shared/helpers';
import AddProductsToPortfolio from './add-products-to-portfolio';
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
  (value, dispatch, filteringCallback, meta) => {
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
  const [state, stateDispatch] = useReducer(porftolioUiReducer, initialState);
  const match = useRouteMatch('/portfolios/detail/:id');
  const history = useHistory();
  const dispatch = useDispatch();
  const { portfolio, meta } = useSelector(
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
      dispatch(fetchPortfolioItemsWithPortfolio(apiProps))
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

  return (
    <Switch>
      <Route path={routes.addProductsRoute}>
        <AddProductsToPortfolio
          portfolio={portfolio}
          portfolioRoute={routes.portfolioRoute}
        />
      </Route>
      <Route
        path={`${routes.orderUrl}/:portfolioItemId`}
        component={PortfolioItemDetail}
      />
      <Route path={routes.portfolioRoute}>
        <PortfolioItems
          routes={routes}
          handleFilterChange={handleFilterChange}
          removeProducts={removeProducts}
          copyPortfolio={handleCopyPortfolio}
          state={state}
          stateDispatch={stateDispatch}
        />
      </Route>
    </Switch>
  );
};

export default Portfolio;
