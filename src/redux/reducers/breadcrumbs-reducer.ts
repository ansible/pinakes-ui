import { ReactNode } from 'react';
import { INITIALIZE_BREADCRUMBS } from '../action-types';
import { AnyObject, ReduxActionHandler } from '../../types/common-types';

export interface BreadcrumbFragment {
  pathname: string;
  searchParams?: string;
  title?: ReactNode;
}
export interface BreadcrumbsReducerState extends AnyObject {
  fragments: BreadcrumbFragment[];
}

export type BreadcrumbsReducerActionHandler = ReduxActionHandler<
  BreadcrumbsReducerState
>;

export const initialBreadcrumbsState: BreadcrumbsReducerState = {
  fragments: []
};

const initialize: BreadcrumbsReducerActionHandler = (state, { payload }) => ({
  ...state,
  fragments: payload
});

export default {
  [INITIALIZE_BREADCRUMBS]: initialize
};
