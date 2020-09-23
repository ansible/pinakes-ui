/* eslint-disable react/prop-types */
import React from 'react';
import debouncePromise from 'awesome-debounce-promise';

import { OnPerPageSelect, OnSetPage, Pagination } from '@patternfly/react-core';

import {
  getCurrentPage,
  getNewPage,
  PaginationConfiguration
} from '../../helpers/shared/pagination';
import { AnyObject } from '@data-driven-forms/react-form-renderer';

export interface AsyncPaginationProps<T = any> extends AnyObject {
  meta: PaginationConfiguration;
  apiRequest: (...args: any[]) => Promise<T>;
  apiProps?: any;
  className?: string;
  isCompact?: boolean;
}
const AsyncPagination: React.ComponentType<AsyncPaginationProps> = ({
  meta: { limit = 50, count = 0, offset = 0 },
  apiProps,
  apiRequest,
  className = '',
  isCompact = false,
  ...props
}) => {
  const handleOnPerPageSelect: OnPerPageSelect = (_event, limit) =>
    apiRequest(apiProps, {
      offset,
      limit
    });

  const handleSetPage: OnSetPage = (_event, number, debounce) => {
    const options = {
      offset: getNewPage(number, limit),
      limit
    };

    const request = () => apiRequest(apiProps, options);
    if (debounce) {
      return debouncePromise(request, 250)();
    }

    return request();
  };

  return (
    <div className={className}>
      <Pagination
        perPage={limit || 50}
        itemCount={count || 0}
        onPerPageSelect={handleOnPerPageSelect}
        page={getCurrentPage(limit, offset)}
        onSetPage={handleSetPage}
        dropDirection="down"
        isCompact={isCompact}
        {...props}
      />
    </div>
  );
};

export default AsyncPagination;
