import React from 'react';
import PropTypes from 'prop-types';
import { Text, TextVariants } from '@patternfly/react-core';

import { ListLoader } from '../../presentational-components/shared/loader-placeholders';

const NoItems = () => (
  <div>
    <Text component={ TextVariants.h1 }>No items found</Text>
  </div>
);

const ContentList = ({ isLoading, items, renderEmptyState }) =>
  isLoading ?
    <ListLoader /> :
    items.length === 0
      ? renderEmptyState
        ? renderEmptyState()
        : <NoItems />
      : (
        { items }
      );

ContentList.propTypes = {
  isLoading: PropTypes.bool,
  items: PropTypes.array,
  renderEmptyState: PropTypes.func
};
export default ContentList;
