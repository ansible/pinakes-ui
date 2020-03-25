import { INITIALIZE_BREADCRUMBS } from '../action-types';

export const initialBreadcrumbsState = {
  fragments: []
};

const initialize = (state, { payload }) => ({ ...state, fragments: payload });

export default {
  [INITIALIZE_BREADCRUMBS]: initialize
};
