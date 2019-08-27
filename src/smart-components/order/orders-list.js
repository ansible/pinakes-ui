import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchOpenOrders, fetchCloseOrders } from '../../redux/actions/order-actions';
import { fetchPortfolioItems } from '../../redux/actions/portfolio-actions';
import { fetchPlatforms } from '../../redux/actions/platform-actions';
import { OrderLoader } from '../../presentational-components/shared/loader-placeholders';
import OrderItem from './order-item';

const OrdersList = ({ type, dataListExpanded, handleDataItemToggle }) => {
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
    return <OrderLoader />;
  }

  return data.map(({ id }, index) => (
    <OrderItem
      key={ id }
      index={ index }
      isExpanded={ dataListExpanded[id] }
      handleDataItemToggle={ handleDataItemToggle }
      type={ type }
    />
  ));
};

export default OrdersList;
