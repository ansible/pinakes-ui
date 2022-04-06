/* eslint-disable react/prop-types */
import React from 'react';
import debouncePromise from 'awesome-debounce-promise';

import { OnPerPageSelect, OnSetPage, Pagination } from '@patternfly/react-core';

import { PaginationConfiguration } from '../../helpers/shared/pagination';
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
  setLimit,
  setOffset,
  apiProps,
  apiRequest,
  className = '',
  isCompact = false,
  ...props
}) => {
  const handleOnPerPageSelect: OnPerPageSelect = (_event, limit) => {
    setLimit(limit);
    return apiRequest(apiProps, {
      offset,
      limit
    });
  };

  const handleSetPage: OnSetPage = (_event, number, debounce) => {
    setOffset(number);
    const options = {
      offset: number,
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
        page={offset || 1}
        onSetPage={handleSetPage}
        dropDirection="down"
        isCompact={isCompact}
        {...props}
      />
    </div>
  );
};

export default AsyncPagination;
