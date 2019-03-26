import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import debouncePromise from 'awesome-debounce-promise';

import { Pagination } from '@red-hat-insights/insights-frontend-components';

import { getCurrentPage, getNewPage } from '../../../helpers/shared/pagination';
import { fetchPlatformItems } from '../../../redux/actions/platform-actions';

const AddProductsPagination = ({ meta: { limit, count, offset }, platformId, fetchPlatformItems }) => {

  const handleOnPerPageSelect = limit => fetchPlatformItems(platformId, {
    offset,
    limit
  });

  const handleSetPage = (number, debounce) => {
    const options = {
      offset: getNewPage(number, limit),
      limit
    };

    const request = () => fetchPlatformItems(platformId, options);
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

AddProductsPagination.propTypes = {
  meta: PropTypes.shape({
    count: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    offset: PropTypes.number.isRequired
  }),
  fetchPlatformItems: PropTypes.func.isRequired,
  platformId: PropTypes.string.isRequired
};

AddProductsPagination.defaultProps = {
  meta: {
    count: 0,
    limit: 50,
    offset: 0
  }
};

const mapDistapchToProps = dispatch => bindActionCreators({
  fetchPlatformItems
}, dispatch);

export default connect(() => ({}), mapDistapchToProps)(AddProductsPagination);

