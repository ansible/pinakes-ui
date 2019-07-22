import React from 'react';
import PropTypes from 'prop-types';
import debouncePromise from 'awesome-debounce-promise';

import { Pagination } from '@redhat-cloud-services/frontend-components';

import { getCurrentPage, getNewPage } from '../../helpers/shared/pagination';

const AsyncPagination = ({ meta: { limit, count, offset }, apiProps, apiRequest }) => {

  const handleOnPerPageSelect = limit => apiRequest(apiProps, {
    offset,
    limit
  });

  const handleSetPage = (number, debounce) => {
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
    <Pagination
      itemsPerPage={ limit || 50 }
      numberOfItems={ count || 50 }
      onPerPageSelect={ handleOnPerPageSelect }
      page={ getCurrentPage(limit, offset) }
      onSetPage={ handleSetPage }
      direction="down"
    />
  );
};

AsyncPagination.propTypes = {
  meta: PropTypes.shape({
    count: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    offset: PropTypes.number.isRequired
  }),
  apiRequest: PropTypes.func.isRequired,
  apiProps: PropTypes.any
};

AsyncPagination.defaultProps = {
  meta: {
    count: 0,
    limit: 50,
    offset: 0
  }
};

export default AsyncPagination;

