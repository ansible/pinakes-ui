import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DataList, Level, LevelItem } from '@patternfly/react-core';
import PropTypes from 'prop-types';

import { fetchOpenOrders, fetchCloseOrders } from '../../redux/actions/order-actions';
import { fetchPlatforms } from '../../redux/actions/platform-actions';
import { OrderLoader } from '../../presentational-components/shared/loader-placeholders';
import OrderItem from './order-item';
import FilterToolbarItem from '../../presentational-components/shared/filter-toolbar-item';
import AsyncPagination from '../common/async-pagination';
import { getOrderPortfolioName } from '../../helpers/shared/orders';

const apiRequest = {
  openOrders: fetchOpenOrders,
  closedOrders: fetchCloseOrders
};

const OrdersList = ({ type  }) => {
  const [ isFetching, setFetching ] = useState(true);
  const [ searchValue, setSearchValue ] = useState('');
  const { data, meta } = useSelector(({ orderReducer }) => orderReducer[type]);
  const portfolioItems = useSelector(({ portfolioReducer: { portfolioItems }}) => portfolioItems.data);
  const dispatch = useDispatch();
  useEffect(() => {
    Promise.all([ dispatch(apiRequest[type]()), dispatch(fetchPlatforms()) ])
    .then(() => setFetching(false));
  }, []);

  const handlePagination = (...args) => {
    setFetching(true);
    dispatch(apiRequest[type](...args))
    .then(() => setFetching(false))
    .catch(() => setFetching(false));
  };

  return (
    <Fragment>
      <div className="pf-u-pb-md pf-u-pl-xl pf-u-pr-xl orders-list">
        <Level>
          <LevelItem className="pf-u-mt-md">
            <FilterToolbarItem searchValue={ searchValue } onFilterChange={ value => setSearchValue(value) } placeholder="Filter by name..." />
          </LevelItem>
          <LevelItem>
            <AsyncPagination isDisabled={ isFetching } apiRequest={ handlePagination } meta={ meta } />
          </LevelItem>
        </Level>
      </div>
      <DataList aria-label={ type }>
        { isFetching
          ? <OrderLoader />
          : data
          .filter(item => getOrderPortfolioName(item, portfolioItems).toLowerCase().includes(searchValue.toLowerCase()))
          .map((item, index) => (
            <OrderItem
              key={ item.id }
              index={ index }
              type={ type }
              item={ item }
            />
          )) }
      </DataList>
    </Fragment>
  );
};

OrdersList.propTypes = {
  type: PropTypes.oneOf([ 'openOrders', 'closedOrders' ]).isRequired
};

export default OrdersList;
