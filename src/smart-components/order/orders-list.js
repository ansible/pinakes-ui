import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DataList } from '@patternfly/react-core';
import PropTypes from 'prop-types';

import { fetchOpenOrders, fetchCloseOrders } from '../../redux/actions/order-actions';
import { fetchPortfolioItems } from '../../redux/actions/portfolio-actions';
import { fetchPlatforms } from '../../redux/actions/platform-actions';
import { OrderLoader } from '../../presentational-components/shared/loader-placeholders';
import OrderItem from './order-item';

const OrdersList = ({ type  }) => {
  const [ isFetching, setFetching ] = useState(true);
  const { data } = useSelector(({ orderReducer }) => orderReducer[type]);
  const dispatch = useDispatch();
  useEffect(() => {
    let ordersRequest;
    if (type === 'openOrders') {
      ordersRequest = fetchOpenOrders;
    } else {
      ordersRequest = fetchCloseOrders;
    }

    Promise.all([ dispatch(fetchPortfolioItems()), dispatch(ordersRequest()), dispatch(fetchPlatforms()) ])
    .then(() => setFetching(false));
  }, []);
  if (isFetching) {
    return (
      <DataList aria-label="orders-loading">
        <OrderLoader />
      </DataList>
    );
  }

  return (
    <DataList aria-label={ type }>
      { data.map(({ id }, index) => (
        <OrderItem
          key={ id }
          index={ index }
          type={ type }
        />
      )) }
    </DataList>
  );
};

OrdersList.propTypes = {
  type: PropTypes.oneOf([ 'openOrders', 'closedOrders' ]).isRequired
};

export default OrdersList;
