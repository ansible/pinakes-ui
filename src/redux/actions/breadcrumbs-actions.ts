import { INITIALIZE_BREADCRUMBS } from '../action-types';
import {
  FRAGMENT_TITLE,
  ENTITIES_EXTRA_PARAMS,
  FRAGMENT_PREFIX
} from '../../helpers/shared/breadcrumbs-creators';
import { Dispatch } from 'redux';
import { BreadcrumbFragment } from '../reducers/breadcrumbs-reducer';
import { CatalogRootState } from '../../types/redux';
import { AnyObject, ReduxAction } from '../../types/common-types';

export const createBreadcrumbsFromLocations = (
  pathname = '',
  search: AnyObject = {}
) => (
  dispatch: Dispatch,
  getState: () => CatalogRootState
): ReduxAction<BreadcrumbFragment[]> => {
  if (pathname.length === 0) {
    return dispatch({ type: INITIALIZE_BREADCRUMBS, payload: [] });
  }

  let result = pathname
    .replace(/^\//, '')
    .split('/')
    .reduce<BreadcrumbFragment[]>((acc, curr, index) => {
      const pathname = `${
        index > 0 && acc[index - 1] ? acc[index - 1].pathname : ''
      }/${curr}`;

      const generateTitle = (FRAGMENT_TITLE[
        pathname as keyof typeof FRAGMENT_TITLE
      ] as unknown) as (getState: () => CatalogRootState) => string;
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
  if (result.length > 0 && (FRAGMENT_PREFIX as AnyObject)[result[0].pathname]) {
    result = [(FRAGMENT_PREFIX as AnyObject)[result[0].pathname], ...result];
  }

  return dispatch({ type: INITIALIZE_BREADCRUMBS, payload: result });
};
