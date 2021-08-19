import { ReactNode } from 'react';
import { INITIALIZE_BREADCRUMBS } from '../action-types';
import {
  AnyObject,
  ReduxActionHandler,
  StringObject
} from '../../types/common-types';

export interface BreadcrumbFragment {
  pathname: string;
  searchParams?: StringObject;
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

const initialize: BreadcrumbsReducerActionHandler = (state, { payload }) => {
  console.log('Debug - breadcrumb reducer - state, payload', state, payload);
  return {
    ...state,
    fragments: payload
  };
};

export default {
  [INITIALIZE_BREADCRUMBS]: initialize
};
