import {
  FETCH_PORTFOLIO,
  FETCH_PORTFOLIOS,
  FETCH_PORTFOLIO_ITEMS,
  FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO,
  FETCH_PORTFOLIO_ITEM,
  FILTER_PORTFOLIO_ITEMS,
  SELECT_PORTFOLIO_ITEM,
  UPDATE_PORTFOLIO,
  SET_LOADING_STATE,
  REMOVE_PORTFOLIO_ITEMS,
  RESET_SELECTED_PORTFOLIO
} from '../action-types';

// Initial State
export const portfoliosInitialState = {
  portfolioItems: { data: [], meta: {}},
  portfolioItem: {},
  portfolios: { data: [], meta: {}},
  portfolio: {},
  filterValue: '',
  isLoading: false
};

const setLoadingState = (state, { payload = true }) => ({ ...state, isLoading: payload });
const setPortfolios = (state, { payload }) => ({ ...state, portfolios: payload, isLoading: false });
const setPortfolioItems = (state, { payload }) => ({ ...state, portfolioItems: payload, isLoading: false });
const setPortfolioItem = (state, { payload }) => ({ ...state, portfolioItem: payload, isLoading: false });
const selectPortfolio = (state, { payload }) => ({ ...state, selectedPortfolio: payload, isLoading: false });
const filterPortfolios = (state, { payload }) => ({ ...state, filterValue: payload });
const resetSelectedPortfolio = state => ({ ...state, selectedPortfolio: undefined, portfolioItems: portfoliosInitialState.portfolioItems });

export default {
  [`${FETCH_PORTFOLIOS}_PENDING`]: setLoadingState,
  [`${FETCH_PORTFOLIOS}_FULFILLED`]: setPortfolios,
  [`${FETCH_PORTFOLIO_ITEMS}_PENDING`]: setLoadingState,
  [`${FETCH_PORTFOLIO_ITEMS}_FULFILLED`]: setPortfolioItems,
  [`${FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO}_PENDING`]: setLoadingState,
  [`${FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO}_FULFILLED`]: setPortfolioItems,
  [`${FETCH_PORTFOLIO_ITEM}_PENDING`]: setLoadingState,
  [`${FETCH_PORTFOLIO_ITEM}_FULFILLED`]: setPortfolioItem,
  [`${FETCH_PORTFOLIO}_PENDING`]: setLoadingState,
  [`${FETCH_PORTFOLIO}_FULFILLED`]: selectPortfolio,
  [FILTER_PORTFOLIO_ITEMS]: filterPortfolios,
  [`${SELECT_PORTFOLIO_ITEM}_FULFILLED`]: setPortfolioItem,
  [SELECT_PORTFOLIO_ITEM]: setPortfolioItem,
  [`${UPDATE_PORTFOLIO}_FULFILLED`]: selectPortfolio,
  [SET_LOADING_STATE]: setLoadingState,
  [`${REMOVE_PORTFOLIO_ITEMS}_PENDING`]: setLoadingState,
  [RESET_SELECTED_PORTFOLIO]: resetSelectedPortfolio
};
