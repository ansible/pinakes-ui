import {
  QUERY_PORTFOLIO
} from '../action-types';

// Initial State
export const shareInfoInitialState = {
  shareInfo: [],
  isLoading: false
};

const setLoadingState = state => ({ ...state, isLoading: true });
const setShareInfo = (state, { payload }) => ({ ...state, shareInfo: payload, isLoading: false });

export default {
  [`${QUERY_PORTFOLIO}_PENDING`]: setLoadingState,
  [`${QUERY_PORTFOLIO}_FULFILLED`]: setShareInfo
};
