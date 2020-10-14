import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createBreadcrumbsFromLocations } from '../redux/actions/breadcrumbs-actions';
import { INITIALIZE_BREADCRUMBS } from '../redux/action-types';
import { AnyObject, ReduxAction } from '../types/common-types';
import { AnyAction } from 'redux';

const useBreadcrumbs = (
  updateTriggers: any[] = []
):
  | (() => ReduxAction<{
      type: typeof INITIALIZE_BREADCRUMBS;
    }>)
  | ReduxAction<{ type: typeof INITIALIZE_BREADCRUMBS }> => {
  const dispatch = useDispatch();
  const { pathname, search } = useLocation();
  if (updateTriggers.length === 0) {
    return dispatch(
      (createBreadcrumbsFromLocations('', {}) as unknown) as AnyAction
    );
  }

  const searchParams = new URLSearchParams(search);
  const searchObject: AnyObject = {};
  searchParams.forEach((value, key) => {
    searchObject[key] = value;
  });

  useEffect(() => {
    dispatch(createBreadcrumbsFromLocations(pathname, searchObject));
  }, [pathname, ...updateTriggers]);

  return () =>
    dispatch((createBreadcrumbsFromLocations('', {}) as unknown) as AnyAction);
};

export default useBreadcrumbs;
