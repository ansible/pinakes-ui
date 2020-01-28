import React, { useEffect, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useHistory,
  useRouteMatch,
  Route,
  Switch,
  useLocation
} from 'react-router-dom';

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
import useQuery from '../../utilities/use-query';
import { createBreadcrumbsFromLocations } from '../../redux/actions/breadcrumbs-actions';
import useBreadCrumbs from '../../utilities/use-breadcrumbs';

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
  const [searchParams] = useQuery(['portfolio']);
  const { portfolio: id } = searchParams;
  const { url } = useRouteMatch('/portfolio');
  const history = useHistory();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { portfolio, portfolioItem, meta } = useSelector(
    ({
      portfolioReducer: {
        selectedPortfolio,
        portfolioItem,
        portfolioItems: { meta }
      }
    }) => ({
      portfolio: selectedPortfolio,
      portfolioItem,
      meta
    })
  );

  const resetBreadcrumbs = useBreadCrumbs([pathname, portfolio, portfolioItem]);

  const fetchData = (apiProps) => {
    stateDispatch({ type: 'setIsFetching', payload: true });
    return Promise.all([
      dispatch(fetchPlatforms()),
      dispatch(fetchSelectedPortfolio(apiProps)),
      dispatch(fetchPortfolioItemsWithPortfolio(apiProps))
    ])
      .then((data) => {
        stateDispatch({ type: 'setIsFetching', payload: false });
        return data;
      })
      .catch(() => stateDispatch({ type: 'setIsFetching', payload: false }));
  };

  useEffect(() => {
    insights.chrome.appNavClick({ id: 'portfolios', secondaryNav: true });
  }, []);

  useEffect(() => {
    fetchData(id);
    scrollToTop();
    return () => {
      resetBreadcrumbs();
      dispatch(resetSelectedPortfolio());
    };
  }, [id]);

  const handleCopyPortfolio = () => {
    stateDispatch({ type: 'setCopyInProgress', payload: true });
    return dispatch(copyPortfolio(id))
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
      id,
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
    portfolioRoute: url,
    addProductsRoute: `${url}/add-products`,
    editPortfolioRoute: `${url}/edit-portfolio`,
    removePortfolioRoute: `${url}/remove-portfolio`,
    sharePortfolioRoute: `${url}/share-portfolio`,
    workflowPortfolioRoute: `${url}/edit-workflow`,
    portfolioItemRoute: `${url}/portfolio-item`
  };

  return (
    <Switch>
      <Route path={routes.addProductsRoute}>
        <AddProductsToPortfolio
          portfolio={portfolio}
          portfolioRoute={routes.portfolioRoute}
        />
      </Route>
      <Route path={routes.portfolioItemRoute}>
        <PortfolioItemDetail portfolioLoaded={!state.isFetching} />
      </Route>
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
