import {
  QUERY_PORTFOLIO,
  SET_LOADING_STATE
} from '../action-types';

// Initial State
export const shareInfoInitialState = {
  shareInfo: [],
  isLoading: false
};

const setLoadingState = (state, { payload = true }) => ({ ...state, isLoading: payload });
const setShareInfo = (state, { payload }) => ({ ...state, shareInfo: payload, isLoading: false });

export default {
  [`${QUERY_PORTFOLIO}_PENDING`]: setLoadingState,
  [`${QUERY_PORTFOLIO}_FULFILLED`]: setShareInfo,
  [SET_LOADING_STATE]: setLoadingState
};
