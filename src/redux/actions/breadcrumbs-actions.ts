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

  let new_pathname = pathname;
  if (pathname === '/portfolios/portfolio') {
    new_pathname = '/portfolio';
  }

  if (pathname === '/portfolios/portfolio/portfolio-item') {
    new_pathname = '/portfolio/portfolio-item';
  }

  if (pathname === '/platforms/platform/platform-templates') {
    new_pathname = '/platform/platform-templates';
  }

  if (pathname === '/platforms/platform/platform-inventories') {
    new_pathname = '/platform/platform-inventories';
  }

  if (pathname === '/platforms/platform/platform-details') {
    new_pathname = '/platform/platform-details';
  }

  if (pathname === '/platforms/platform') {
    new_pathname = '/platform';
  }

  let result = new_pathname
    .replace(/^\//, '')
    .split('/')
    .reduce<BreadcrumbFragment[]>((acc, curr, index) => {
      const pathname = `${
        index > 0 && acc[index - 1] ? acc[index - 1].pathname : ''
      }/${curr}`;

      const generateTitle = (FRAGMENT_TITLE[
        pathname as keyof typeof FRAGMENT_TITLE
      ] as unknown) as (getState: GetReduxState) => string;
      if (!generateTitle) {
        return acc;
      }

      const searchParams = {
        ...(index > 0 && acc[index - 1].searchParams),
        ...(search[curr] ? { [curr]: search[curr] } : {})
      };
      if ((ENTITIES_EXTRA_PARAMS as AnyObject)[curr]) {
        (ENTITIES_EXTRA_PARAMS as AnyObject)[curr].forEach((key: string) => {
          searchParams[key] = search[key];
        });
      }

      return [
        ...acc,
        {
          pathname,
          searchParams,
          title: generateTitle(getState)
        }
      ];
    }, []);

  if (result.length > 0) {
    if (result[0].pathname === '/portfolio') {
      result[0].pathname = '/portfolios/portfolio';
    }

    if (result[0].pathname === '/portfolio/portfolio-item') {
      result[0].pathname = '/portfolios/portfolio/portfolio-item';
    }

    if (result[0].pathname === '/platform/platform-templates') {
      result[0].pathname = '/platforms/platform/platform-templates';
    }

    if (result[0].pathname === '/platform/platform-inventories') {
      result[0].pathname = '/platforms/platform/platform-inventories';
    }

    if (result[0].pathname === '/platform/platform-details') {
      result[0].pathname = '/platforms/platform/platform-details';
    }

    if (result[0].pathname === '/platform') {
      result[0].pathname = '/platforms/platform';
    }

    console.log('Debug - result', result);

    if ((FRAGMENT_PREFIX as AnyObject)[result[0].pathname]) {
      result = [(FRAGMENT_PREFIX as AnyObject)[result[0].pathname], ...result];
    }
  }
  console.log('Debug2 - result', result);
  return dispatch({ type: INITIALIZE_BREADCRUMBS, payload: result });
};
