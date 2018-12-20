import {
  FETCH_PORTFOLIO,
  FETCH_PORTFOLIOS,
  FETCH_PORTFOLIO_ITEMS,
  FETCH_PORTFOLIO_ITEMS_WITH_PORTFOLIO,
  FETCH_PORTFOLIO_ITEM,
  FILTER_PORTFOLIO_ITEMS
} from '../../redux/ActionTypes';

// Initial State
export const portfoliosInitialState = {
  portfolioItems: [],
  portfolioItem: {},
  portfolios: [],
  portfolio: {},
  filterValue: '',
  isLoading: true
};

const setLoadingState = state => ({ ...state, isLoading: true });
const setPortfolios = (state, { payload }) => ({ ...state, portfolios: payload, isLoading: false });
const setPortfolioItems = (state, { payload }) => ({ ...state, portfolioItems: payload, isLoading: false });
const setPortfolioItem = (state, { payload }) => ({ ...state, portfolioItem: payload, isLoading: false });
const selectPortfolio = (state, { payload }) => ({ ...state, selectedPortfolio: payload, isLoading: false });
const filterPortfolios = (state, { payload }) => ({ ...state, filterValue: payload });

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
  [`${FILTER_PORTFOLIO_ITEMS}_FULFILLED`]: filterPortfolios
};
