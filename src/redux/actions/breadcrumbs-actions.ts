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

  const prefix: string[] = [];
  if (pathname === '/portfolios/portfolio') {
    prefix.push('/portfolios');
  }

  if (pathname.startsWith('/portfolios/portfolio/portfolio-item')) {
    prefix[0] = '/portfolios';
    prefix[1] = '/portfolio';
    if (pathname.startsWith('/portfolios/portfolio/portfolio-item/')) {
      prefix[2] = '/portfolio-item';
    }
  }

  if (pathname.startsWith('/platforms/platform')) {
    prefix[0] = '/platforms';
  }

  pathname = pathname.replace(prefix[0], '');
  let result = pathname
    .replace(/^\//, '')
    .split('/')
    .reduce<BreadcrumbFragment[]>((acc, curr, index) => {
      console.log('Debug - acc: ', acc);
      console.log('Debug - index: ', index);
      console.log('Debug - curr: ', curr);
      console.log('Debug - prefix: ', prefix);
      const pathname = `${
        index > 0 && acc[index - 1] ? acc[index - 1].pathname : ''
      }${prefix[index]}/${curr}`;
      console.log('Debug - ${prefix[index]}: ', `${prefix[index]}`);
      console.log('Debug 00 - pathname: ', pathname);
      const generateTitle = (FRAGMENT_TITLE[
        pathname as keyof typeof FRAGMENT_TITLE
      ] as unknown) as (getState: GetReduxState) => string;
      if (!generateTitle) {
        console.log('Debug - return acc: ', acc);
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

      if ((FRAGMENT_PREFIX as AnyObject)[pathname]) {
        acc = [(FRAGMENT_PREFIX as AnyObject)[pathname]];
      }

      const currTitle = generateTitle(getState);

      return !currTitle
        ? acc
        : [
            ...acc,
            {
              pathname,
              searchParams,
              title: currTitle
            }
          ];
    }, []);
  if (result.length > 0 && (FRAGMENT_PREFIX as AnyObject)[result[0].pathname]) {
    result = [(FRAGMENT_PREFIX as AnyObject)[result[0].pathname], ...result];
  }

  console.log('Debug - result: ', result);
  // if portfolio item, add the 2 breadcrumbs
  return dispatch({ type: INITIALIZE_BREADCRUMBS, payload: result });
};
