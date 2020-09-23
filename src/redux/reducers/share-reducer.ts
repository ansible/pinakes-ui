import { ShareInfo } from '@redhat-cloud-services/catalog-client';
import { QUERY_PORTFOLIO, SET_LOADING_STATE } from '../action-types';
import { ReduxActionHandler } from '../../types/common-types';

export interface ShareReducerState {
  shareInfo: ShareInfo[];
  isLoading: boolean;
}

export type ShareReducerActionHandler = ReduxActionHandler<ShareReducerState>;
export const shareInfoInitialState: ShareReducerState = {
  shareInfo: [],
  isLoading: false
};

const setLoadingState: ShareReducerActionHandler = (
  state,
  { payload = true }
) => ({
  ...state,
  isLoading: payload
});
const setShareInfo: ShareReducerActionHandler = (state, { payload }) => ({
  ...state,
  shareInfo: payload,
  isLoading: false
});

export default {
  [`${QUERY_PORTFOLIO}_PENDING`]: setLoadingState,
  [`${QUERY_PORTFOLIO}_FULFILLED`]: setShareInfo,
  [SET_LOADING_STATE]: setLoadingState
};
