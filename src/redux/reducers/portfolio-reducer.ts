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
import {
  ApiCollectionResponse,
  AnyObject,
  ReduxActionHandler,
  InternalPortfolio
} from '../../types/common-types';
import { PortfolioItem } from '@redhat-cloud-services/catalog-client';
import { defaultSettings } from '../../helpers/shared/pagination';

export interface PortfolioItemStateObject {
  portfolioItem: PortfolioItem;
}
export interface PortfolioReducerState extends AnyObject {
  portfolioItems: ApiCollectionResponse<PortfolioItem>;
  portfolioItem: PortfolioItemStateObject;
  portfolios: ApiCollectionResponse<InternalPortfolio>;
  selectedPortfolio: InternalPortfolio;
  portfolio: InternalPortfolio;
  filterValue: string;
  isLoading: boolean;
}

export type PortfolioReducerActionHandler = ReduxActionHandler<
  PortfolioReducerState
>;

export const portfoliosInitialState: PortfolioReducerState = {
  portfolioItems: {
    data: [],
    results: [],
    meta: { limit: 50, offset: 0, filter: '' }
  },
  portfolioItem: {
    portfolioItem: {
      metadata: {
        user_capabilities: {},
        statistics: {}
      }
    }
  },
  portfolios: {
    data: [],
    results: [],
    meta: defaultSettings
  },
  selectedPortfolio: {
    metadata: {
      user_capabilities: {},
      statistics: {}
    }
  },
  portfolio: {
    metadata: {
      user_capabilities: {},
      statistics: {}
    }
  },
  filterValue: '',
  isLoading: false
};

const setLoadingState: PortfolioReducerActionHandler = (
  state,
  { payload = true }
) => ({
  ...state,
  isLoading: payload
});
const setPortfolios: PortfolioReducerActionHandler = (state, { payload }) => ({
  ...state,
  portfolios: payload,
  isLoading: false
});
const setPortfolioItems: PortfolioReducerActionHandler = (
  state,
  { payload }
) => ({
  ...state,
  portfolioItems: payload,
  isLoading: false
});
const setPortfolioItem: PortfolioReducerActionHandler = (
  state,
  { payload }
) => {
  return {
    ...state,
    portfolioItem: {
      ...payload,
      metadata: {
        user_capabilities: {
          show: true,
          update: true,
          tags: true,
          share: true,
          unshare: true,
          untag: true,
          tag: true,
          set_order_process: true,
          create: true,
          destroy: true,
          restore: true,
          copy: true,
          orderable: true
        }
      }
    },
    isLoading: false
  };
};

const selectPortfolio: PortfolioReducerActionHandler = (
  state,
  { payload }
) => ({
  ...state,
  selectedPortfolio: payload,
  isLoading: false
});
const filterPortfolios: PortfolioReducerActionHandler = (
  state,
  { payload }
) => ({
  ...state,
  filterValue: payload
});
const resetSelectedPortfolio: PortfolioReducerActionHandler = (state) => ({
  ...state,
  selectedPortfolio: { metadata: { user_capabilities: {}, statistics: {} } },
  portfolioItems: portfoliosInitialState.portfolioItems
});

// these are optimistic UI updates that mutate the portfolio state immediately after user action.
// State is synchronized with API after actions are successful
const addTemporaryPortfolio: PortfolioReducerActionHandler = (
  state,
  { payload }
) => ({
  prevState: { ...state },
  ...state,
  portfolios: {
    ...state.portfolios,
    data: [{ ...payload, metadata: { user_capabilities: {}, statistics: {} } }],
    results: [
      { ...payload, metadata: { user_capabilities: {}, statistics: {} } }
    ]
  }
});
const updateTemporaryPortfolio: PortfolioReducerActionHandler = (
  state,
  { payload }
) => {
  return {
    prevState: { ...state },
    ...state,
    selectedPortfolio: {
      metadata: {
        ...state.selectedPortfolio.metadata,
        user_capabilities: {
          // the client typings define metadata object which will result it unknown property TS error. So we have to override it
          ...(state.selectedPortfolio?.metadata as AnyObject)?.user_capabilities
        }
      },
      ...payload
    },
    portfolios: {
      ...state.portfolios,
      // @ts-ignore
      data: state.portfolios?.data?.map((item: { id: any }) =>
        item.id === payload.id
          ? {
              ...item,
              ...payload
            }
          : item
      ),
      results: state.portfolios?.results?.map((item) => {
        return String(item.id) === String(payload.id)
          ? {
              ...item,
              ...payload
            }
          : item;
      })
    }
  };
};

const deleteTemporaryPortfolio: PortfolioReducerActionHandler = (
  state,
  { payload }
) => ({
  prevState: { ...state },
  ...state,
  selectedPortfolio: { metadata: { user_capabilities: {}, statistics: {} } },
  portfolios: {
    ...state.portfolios,
    data: state.portfolios?.data?.filter(({ id }) => id !== payload),
    results: state.portfolios?.results?.filter(({ id }) => id !== payload)
  }
});

const updateTemporaryPortfolioItem: PortfolioReducerActionHandler = (
  state,
  { payload }
) => ({
  ...state,
  prevState: { ...state },
  portfolioItem: {
    ...state.portfolioItem,
    portfolioItem: {
      created_at: state.portfolioItem.portfolioItem.created_at,
      updated_at: new Date().toString(),
      ...payload
    }
  },
  portfolioItems: {
    ...state.portfolioItems,
    data: state.portfolioItems?.data?.map((item) =>
      item.id === payload.id
        ? { created_at: item.created_at, ...payload }
        : item
    ),
    results: state.portfolioItems?.results?.map((item) =>
      item.id === payload.id
        ? { created_at: item.created_at, ...payload }
        : item
    )
  }
});

const updatePortfolioItem: PortfolioReducerActionHandler = (
  state,
  { payload }
) => ({
  ...state,
  portfolioItem: {
    ...state.portfolioItem,
    portfolioItem: payload
  },
  portfolioItems: {
    ...state.portfolioItems,
    data: state.portfolioItems?.data?.map((item) =>
      item.id === payload.id ? { ...payload } : item
    ),
    results: state.portfolioItems?.results?.map((item) =>
      item.id === payload.id ? { ...payload } : item
    )
  }
});

const restorePrevState: PortfolioReducerActionHandler = (state) =>
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
