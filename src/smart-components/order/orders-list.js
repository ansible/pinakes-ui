import React, { useEffect, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DataList, Level, LevelItem, Grid, GridItem } from '@patternfly/react-core';
import { Section } from '@redhat-cloud-services/frontend-components';

import { fetchOrders } from '../../redux/actions/order-actions';
import { fetchPlatforms } from '../../redux/actions/platform-actions';
import { ListLoader } from '../../presentational-components/shared/loader-placeholders';
import OrderItem from './order-item';
import FilterToolbarItem from '../../presentational-components/shared/filter-toolbar-item';
import AsyncPagination from '../common/async-pagination';
import asyncFormValidator from '../../utilities/async-form-validator';
import { defaultSettings } from '../../helpers/shared/pagination';

const debouncedFilter = asyncFormValidator((value, dispatch, filteringCallback) => {
  filteringCallback(true);
  dispatch(fetchOrders(value, defaultSettings)).then(() => filteringCallback(false));
}, 1000);

const initialState = {
  filterValue: '',
  isOpen: false,
  isFetching: true,
  isFiltering: false
};

const ordersListState = (state, action) => {
  switch (action.type) {
    case 'setFetching':
      return { ...state, isFetching: action.payload };
    case 'setFilterValue':
      return { ...state, filterValue: action.payload };
    case 'setFilteringFlag':
      return { ...state, isFiltering: action.payload };
  }

  return state;
};

const OrdersList = () => {
  const [{ isFetching, filterValue, isFiltering }, stateDispatch ] = useReducer(ordersListState, initialState);
  const { data, meta } = useSelector(({ orderReducer }) => orderReducer.orders);
  const dispatch = useDispatch();
  useEffect(() => {
    stateDispatch({ type: 'setFetching', payload: true });
    Promise.all([ dispatch(fetchOrders(filterValue, meta)), dispatch(fetchPlatforms()) ])
    .then(() => stateDispatch({ type: 'setFetching', payload: false }));
  }, []);

  const handlePagination = (_apiProps, pagination) => {
    stateDispatch({ type: 'setFetching', payload: true });
    dispatch(fetchOrders(filterValue, pagination))
    .then(() => stateDispatch({ type: 'setFetching', payload: false }))
    .catch(() => stateDispatch({ type: 'setFetching', payload: false }));
  };

  const handleFilterItems = value => {
    stateDispatch({ type: 'setFilterValue', payload: value });
    debouncedFilter(value, dispatch, isFiltering => stateDispatch({ type: 'setFilteringFlag', payload: isFiltering }));
  };

  console.log('data: ', data)

  return (
    <Grid gutter="md">
      <GridItem>
        <Section type="content">
          <div className="pf-u-pb-md pf-u-pl-xl pf-u-pr-xl orders-list">
            <Level>
              <LevelItem className="pf-u-mt-md">
                <FilterToolbarItem
                  searchValue={ filterValue }
                  onFilterChange={ value => handleFilterItems(value) }
                  placeholder="Filter by name..."
                />
              </LevelItem>
              <LevelItem>
                <AsyncPagination isDisabled={ isFetching || isFiltering } apiRequest={ handlePagination } meta={ meta } />
              </LevelItem>
            </Level>
          </div>
          <DataList aria-label="order-list">
            { isFiltering || isFetching
              ? <ListLoader />
              : data.map((item, index) => (
                <OrderItem
                  key={ item.id }
                  index={ index }
                  item={ item }
                />
              )) }
          </DataList>
        </Section>
      </GridItem>
    </Grid>
  );
};

export default OrdersList;
