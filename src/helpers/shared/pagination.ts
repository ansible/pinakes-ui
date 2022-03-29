import { ApiMetadata } from '../../types/common-types';
import { SortByDirection } from '@patternfly/react-table';
import { isStandalone } from './helpers';

export interface PaginationConfiguration extends ApiMetadata {
  filter?: string;
  sortDirection?: SortByDirection;
}

export const defaultSettings: PaginationConfiguration = {
  limit: 50,
  offset: 0,
  count: 0,
  filter: ''
};

export const getCurrentPage = (limit = 1, offset = 0): number => {
  console.log('Debug - getCurrentPage - limit, offset', limit, offset);
  return isStandalone() ? offset : Math.floor(offset / limit) + 1;
};

export const getNewPage = (page = 1, offset = 0): number => {
  return isStandalone() ? page : (page - 1) * offset;
};
