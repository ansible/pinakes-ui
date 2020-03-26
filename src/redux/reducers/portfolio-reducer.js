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
  RESET_SELECTED_PORTFOLIO,
  ADD_TEMPORARY_PORTFOLIO,
  UPDATE_TEMPORARY_PORTFOLIO,
  DELETE_TEMPORARY_PORTFOLIO,
  RESTORE_PORTFOLIO_PREV_STATE,
  SET_PORTFOLIO_ITEMS,
  UPDATE_TEMPORARY_PORTFOLIO_ITEM,
  UPDATE_PORTFOLIO_ITEM,
  RESTORE_PORTFOLIO_ITEM_PREV_STATE
} from '../action-types';

// Initial State
export const portfoliosInitialState = {
  portfolioItems: {
    data: [],
    meta: {
      limit: 50,
      offset: 0,
      filter: ''
    }
  },
  portfolioItem: {
    portfolioItem: {
      metadata: {
        user_capabilities: {}
      }
    }
  },
  portfolios: {
    data: [],
    meta: {
      limit: 50,
      offset: 0
    }
  },
  selectedPortfolio: {
    metadata: {
      user_capabilities: {}
    }
  },
  portfolio: {},
  filterValue: '',
  isLoading: false
};

const setLoadingState = (state, { payload = true }) => ({
  ...state,
  isLoading: payload
});
const setPortfolios = (state, { payload }) => ({
  ...state,
  portfolios: payload,
  isLoading: false
});
const setPortfolioItems = (state, { payload }) => ({
  ...state,
  portfolioItems: payload,
  isLoading: false
});
const setPortfolioItem = (state, { payload }) => ({
  ...state,
  portfolioItem: payload,
  isLoading: false
});
const selectPortfolio = (state, { payload }) => ({
  ...state,
  selectedPortfolio: payload,
  isLoading: false
});
const filterPortfolios = (state, { payload }) => ({
  ...state,
  filterValue: payload
});
const resetSelectedPortfolio = (state) => ({
  ...state,
  selectedPortfolio: { metadata: { user_capabilities: {} } },
  portfolioItems: portfoliosInitialState.portfolioItems
});

// these are optimistic UI updates that mutate the portfolio state immediately after user action.
// State is synchronized with API after actions are sucesfull
const addTemporaryPortfolio = (state, { payload }) => ({
  prevState: { ...state },
  ...state,
  portfolios: {
    ...state.portfolios,
    data: [...state.portfolios.data, payload]
  }
});
const updateTemporaryPortfolio = (state, { payload }) => ({
  prevState: { ...state },
  ...state,
  selectedPortfolio: payload,
  portfolios: {
    ...state.portfolios,
    data: state.portfolios.data.map((item) =>
      item.id === payload.id
        ? {
            ...item,
            ...payload
          }
        : item
    )
  }
});

const deleteTemporaryPortfolio = (state, { payload }) => ({
  prevState: { ...state },
  ...state,
  selectedPortfolio: {},
  portfolios: {
    ...state.portfolios,
    data: state.portfolios.data.filter(({ id }) => id !== payload)
  }
});

const updateTemporaryPortfolioItem = (state, { payload }) => ({
  ...state,
  prevState: { ...state },
  portfolioItem: {
    ...state.portfolioItem,
    portfolioItem: payload
  },
  portfolioItems: {
    ...state.portfolioItems,
    data: state.portfolioItems.data.map((item) =>
      item.id === payload.id ? { ...payload } : item
    )
  }
});

const updatePortfolioItem = (state, { payload }) => ({
  ...state,
  portfolioItem: {
    ...state.portfolioItem,
    portfolioItem: payload
  },
  portfolioItems: {
    ...state.portfolioItems,
    data: state.portfolioItems.data.map((item) =>
      item.id === payload.id ? { ...payload } : item
    )
  }
});

const restorePrevState = (state) =>
  state.prevState ? { ...state.prevState } : { ...state };

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
  [RESET_SELECTED_PORTFOLIO]: resetSelectedPortfolio,
  [ADD_TEMPORARY_PORTFOLIO]: addTemporaryPortfolio,
  [UPDATE_TEMPORARY_PORTFOLIO]: updateTemporaryPortfolio,
  [DELETE_TEMPORARY_PORTFOLIO]: deleteTemporaryPortfolio,
  [RESTORE_PORTFOLIO_PREV_STATE]: restorePrevState,
  [SET_PORTFOLIO_ITEMS]: setPortfolioItems,
  [UPDATE_TEMPORARY_PORTFOLIO_ITEM]: updateTemporaryPortfolioItem,
  [RESTORE_PORTFOLIO_ITEM_PREV_STATE]: restorePrevState,
  [UPDATE_PORTFOLIO_ITEM]: updatePortfolioItem
};
