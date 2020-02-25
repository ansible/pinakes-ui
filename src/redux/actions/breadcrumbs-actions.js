import { INITIALIZE_BREADCRUMBS } from '../action-types';
import {
  FRAGMENT_TITLE,
  ENTITIES_EXTRA_PARAMS,
  FRAGMENT_PREFIX
} from '../../helpers/shared/breadcrumbs-creators';

export const createBreadcrumbsFromLocations = (pathname = '', search = {}) => (
  dispatch,
  getState
) => {
  if (pathname.length === 0) {
    return dispatch({ type: INITIALIZE_BREADCRUMBS, payload: [] });
  }

  let result = pathname
    .replace(/^\//, '')
    .split('/')
    .reduce((acc, curr, index) => {
      const pathname = `${
        index > 0 && acc[index - 1] ? acc[index - 1].pathname : ''
      }/${curr}`;

      const generateTitle = FRAGMENT_TITLE[pathname];
      if (!generateTitle) {
        return acc;
      }

      const searchParams = {
        ...(index > 0 && acc[index - 1].searchParams),
        ...(search[curr] ? { [curr]: search[curr] } : {})
      };
      if (ENTITIES_EXTRA_PARAMS[curr]) {
        ENTITIES_EXTRA_PARAMS[curr].forEach((key) => {
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
  if (result.length > 0 && FRAGMENT_PREFIX[result[0].pathname]) {
    result = [FRAGMENT_PREFIX[result[0].pathname], ...result];
  }

  return dispatch({ type: INITIALIZE_BREADCRUMBS, payload: result });
};
