import { INITIALIZE_BREADCRUMBS } from '../action-types';
import {
  FRAGMENT_TITLE,
  ENTITIES_EXTRA_PARAMS,
  FRAGMENT_PREFIX
} from '../../helpers/shared/breadcrumbs-creators';
import { Dispatch } from 'redux';
import { BreadcrumbFragment } from '../reducers/breadcrumbs-reducer';
import { GetReduxState } from '../../types/redux';
import { AnyObject, ReduxAction } from '../../types/common-types';

export const createBreadcrumbsFromLocations = (
  pathname = '',
  search: AnyObject = {}
) => (
  dispatch: Dispatch,
  getState: GetReduxState
): ReduxAction<BreadcrumbFragment[]> => {
  if (pathname.length === 0) {
    return dispatch({ type: INITIALIZE_BREADCRUMBS, payload: [] });
  }
  console.log(
    'Debug - createBreadcrumbsFromLocations pathname, search',
    pathname,
    search
  );
  console.log('debug - pathname.replace', pathname.replace(/^\//, ''));
  let prefix = '';
  if (pathname.startsWith('/portfolios/portfolio')) {
    prefix = '/portfolios';
  }
  if (pathname.startsWith('/platforms/platform')) {
    prefix = '/platforms';
  }
  pathname = pathname.replace(prefix, '');
  console.log('debug - prefix, pathname', prefix, pathname);
  let result = pathname
    .replace(/^\//, '')
    .split('/')
    .reduce<BreadcrumbFragment[]>((acc, curr, index) => {
      const pathname = `${
        index > 0 && acc[index - 1] ? acc[index - 1].pathname : ''
      }${prefix}/${curr}`;
      console.log(
        'Debug - generate title:  curr, acc',
        `${prefix}/${curr}`,
        acc
      );
      const generateTitle = (FRAGMENT_TITLE[
        pathname as keyof typeof FRAGMENT_TITLE
      ] as unknown) as (getState: GetReduxState) => string;
      if (!generateTitle) {
        console.log('Debug - no generate title - return acc: ', acc);
        return acc;
      }
      const searchParams = {
        ...(index > 0 && acc[index - 1]?.searchParams),
        ...(search[curr] ? { [curr]: search[curr] } : {})
      };
      if ((ENTITIES_EXTRA_PARAMS as AnyObject)[curr]) {
        (ENTITIES_EXTRA_PARAMS as AnyObject)[curr].forEach((key: string) => {
          searchParams[key] = search[key];
        });
      }
      console.log('Debug ACC: pathname, acc: ', pathname, acc);
      if ((FRAGMENT_PREFIX as AnyObject)[pathname]) {
        acc = [(FRAGMENT_PREFIX as AnyObject)[pathname]];
      }
      console.log('Debug - About to return: pathname, acc: ', pathname, acc);
      return [
        ...acc,
        {
          pathname,
          searchParams,
          title: generateTitle(getState)
        }
      ];
    }, []);
  console.log('Debug - pathname, result: ', pathname, result);
  if (result.length > 0 && (FRAGMENT_PREFIX as AnyObject)[result[0].pathname]) {
    result = [(FRAGMENT_PREFIX as AnyObject)[result[0].pathname], ...result];
  }
  return dispatch({ type: INITIALIZE_BREADCRUMBS, payload: result });
};
