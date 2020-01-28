import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createBreadcrumbsFromLocations } from '../redux/actions/breadcrumbs-actions';

const useBreadCrumbs = (updateTriggers = []) => {
  const dispatch = useDispatch();
  const { pathname, search } = useLocation();
  if (updateTriggers.length === 0) {
    return dispatch(createBreadcrumbsFromLocations('', {}));
  }

  const searchParams = new URLSearchParams(search);
  const searchObject = {};
  searchParams.forEach((value, key) => {
    searchObject[key] = value;
  });

  useEffect(() => {
    dispatch(createBreadcrumbsFromLocations(pathname, searchObject));
  }, updateTriggers);

  return () => dispatch(createBreadcrumbsFromLocations('', {}));
};

export default useBreadCrumbs;
