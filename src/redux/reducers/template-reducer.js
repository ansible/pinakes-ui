import {
  FETCH_TEMPLATE,
  FETCH_TEMPLATES,
  SORT_TEMPLATES,
  SET_FILTER_TEMPLATES,
  CLEAR_FILTER_TEMPLATES,
  UPDATE_TEMPLATE
} from '../action-types';

// Initial State
export const templatesInitialState = {
  templates: {
    data: [],
    meta: {
      count: 0,
      limit: 50,
      offset: 0
    }
  },
  template: {},
  filterValue: '',
  isLoading: false,
  isRecordLoading: false,
  isUpdating: 0,
  sortBy: {
    index: 2,
    property: 'sequence',
    direction: 'asc'
  }
};

const setLoadingState = (state) => ({ ...state, isLoading: true });
const setRecordLoadingState = (state) => ({ ...state, isRecordLoading: true });
const setTemplates = (state, { payload }) => ({
  ...state,
  templates: payload,
  isLoading: false
});
const selectTemplate = (state, { payload }) => ({
  ...state,
  template: payload,
  isRecordLoading: false
});
const setSortTemplates = (state, { payload }) => ({
  ...state,
  sortBy: payload,
  templates: {
    ...state.templates,
    meta: {
      ...state.templates.meta,
      offset: 0
    }
  }
});
const setFilterValue = (state, { payload }) => ({
  ...state,
  filterValue: payload,
  templates: {
    ...state.templates,
    meta: {
      ...state.templates.meta,
      offset: 0
    }
  }
});

const setUpdatingTemplate = (state) => ({
  ...state,
  isUpdating: state.isUpdating + 1
});
const finishUpdatingTemplate = (state) => ({
  ...state,
  isUpdating: state.isUpdating - 1
});

const clearFilterValue = (state) => ({
  ...state,
  filterValue: ''
});

export default {
  [`${FETCH_TEMPLATES}_PENDING`]: setLoadingState,
  [`${FETCH_TEMPLATES}_FULFILLED`]: setTemplates,
  [`${FETCH_TEMPLATE}_PENDING`]: setRecordLoadingState,
  [`${FETCH_TEMPLATE}_FULFILLED`]: selectTemplate,
  [`${UPDATE_TEMPLATE}_PENDING`]: setUpdatingTemplate,
  [`${UPDATE_TEMPLATE}_FULFILLED`]: finishUpdatingTemplate,
  [`${UPDATE_TEMPLATE}_REJECTED`]: finishUpdatingTemplate,
  [SORT_TEMPLATES]: setSortTemplates,
  [SET_FILTER_TEMPLATES]: setFilterValue,
  [CLEAR_FILTER_TEMPLATES]: clearFilterValue
};
