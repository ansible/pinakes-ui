import {
  FETCH_PLATFORM_DATA,
  ADD_PLATFORM
} from '../ActionTypes';

//User insighs redux API
// Initial State
export const addPlatformInitialState = {
  isLoading: true
};

// TODO add action generators (pending, fulfiller...)

const setLoadingState = state => ({ ...state, isLoading: true });
const setPlatformData = (state, { payload }) => ({ ...state, ...payload, isLoading: false });

export default {
  [`${FETCH_PLATFORM_DATA}_PENDING`]: setLoadingState,
  [`${FETCH_PLATFORM_DATA}_FULFILLED`]: setPlatformData,
  [`${ADD_PLATFORM}_PENDING`]: setLoadingState,
  [`${ADD_PLATFORM}_FULFILLED`]: setPlatformData
};
