import React, { useEffect, useReducer, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Grid,
  GridItem,
  Title,
  Bullseye,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Flex,
  EmptyStateSecondaryActions,
  Button
} from '@patternfly/react-core';
import { Section } from '@redhat-cloud-services/frontend-components/components/cjs/Section';
// import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/components/cjs/PrimaryToolbar';
import { EmptyTable } from '@redhat-cloud-services/frontend-components/components/cjs/EmptyTable';
// import { TableToolbar } from '@redhat-cloud-services/frontend-components/components/cjs/TableToolbar';
import { SearchIcon } from '@patternfly/react-icons';

import { fetchOrders } from '../../redux/actions/order-actions';
import { fetchPlatforms } from '../../redux/actions/platform-actions';
import { ListLoader } from '../../presentational-components/shared/loader-placeholders';
import OrderItem from './order-item';
import AsyncPagination from '../common/async-pagination';
import asyncFormValidator from '../../utilities/async-form-validator';
import { defaultSettings } from '../../helpers/shared/pagination';
import {
  Table,
  Tbody
} from '../../presentational-components/styled-components/table';
import useInitialUriHash from '../../routing/use-initial-uri-hash';

const debouncedFilter = asyncFormValidator(
  (filters, meta = defaultSettings, dispatch, filteringCallback) => {
    filteringCallback(true);
    dispatch(fetchOrders(filters, meta)).then(() => filteringCallback(false));
  },
  1000
);

const initialState = {
  isOpen: false,
  isFetching: true,
  isFiltering: false,
  filterType: 'state',
  filters: {
    state: [],
    owner: ''
  }
};

const changeFilters = (value, type, filters) => ({
  ...filters,
  [type]: value
});

const ordersListState = (state, action) => {
  switch (action.type) {
    case 'setFetching':
      return { ...state, isFetching: action.payload };
    case 'setFilterValue':
      return {
        ...state,
        filters: changeFilters(action.payload, state.filterType, state.filters)
      };
    case 'replaceFilterChip':
      return { ...state, filters: action.payload };
    case 'setFilteringFlag':
      return { ...state, isFiltering: action.payload };
    case 'setFilterType':
      return { ...state, filterType: action.payload };
  }

  return state;
};

const PrimaryToolbar = Fragment;
const TableToolbar = Fragment;

const OrdersList = () => {
  const viewState = useInitialUriHash();
  const [
    { isFetching, isFiltering, filterType, filters },
    stateDispatch
  ] = useReducer(ordersListState, {
    ...initialState,
    filters: viewState?.orders?.filters || { state: [], owner: '' }
  });
  const { data, meta } = useSelector(({ orderReducer }) => orderReducer.orders);
  const dispatch = useDispatch();
  useEffect(() => {
    stateDispatch({ type: 'setFetching', payload: true });
    Promise.all([
      dispatch(fetchOrders(filters, viewState?.orders)),
      dispatch(fetchPlatforms())
    ]).then(() => stateDispatch({ type: 'setFetching', payload: false }));
  }, []);

  const handlePagination = (_apiProps, pagination) => {
    stateDispatch({ type: 'setFetching', payload: true });
    return dispatch(fetchOrders(filters, pagination))
      .then(() => stateDispatch({ type: 'setFetching', payload: false }))
      .catch(() => stateDispatch({ type: 'setFetching', payload: false }));
  };

  const handleFilterItems = (value) => {
    stateDispatch({ type: 'setFilterValue', payload: value });
    debouncedFilter(
      { ...filters, [filterType]: value },
      { ...meta, offset: 0 },
      dispatch,
      (isFiltering) =>
        stateDispatch({ type: 'setFilteringFlag', payload: isFiltering })
    );
  };

  return (
    <Grid gutter="md">
      <GridItem>
        <Section type="content">
          {!meta.noData && (
            <PrimaryToolbar
              activeFiltersConfig={{
                filters: Object.entries(filters)
                  .filter(([, value]) => value && value.length > 0)
                  .map(([key, value]) => ({
                    category: key,
                    type: key,
                    chips: Array.isArray(value)
                      ? value.map((name) => ({ name }))
                      : [{ name: value }]
                  })),
                onDelete: (_e, [chip], clearAll) => {
                  if (clearAll) {
                    stateDispatch({
                      type: 'replaceFilterChip',
                      payload: initialState.filters
                    });
                    return debouncedFilter(
                      initialState.filters,
                      meta,
                      dispatch,
                      (isFiltering) =>
                        stateDispatch({
                          type: 'setFilteringFlag',
                          payload: isFiltering
                        })
                    );
                  }

                  const newFilters = { ...filters };
                  if (chip.type === 'state') {
                    newFilters[chip.type] = newFilters[chip.type].filter(
                      (value) => value !== chip.chips[0].name
                    );
                  } else {
                    newFilters[chip.type] = '';
                  }

                  stateDispatch({
                    type: 'replaceFilterChip',
                    payload: newFilters
                  });
                  debouncedFilter(newFilters, meta, dispatch, (isFiltering) =>
                    stateDispatch({
                      type: 'setFilteringFlag',
                      payload: isFiltering
                    })
                  );
                }
              }}
              filterConfig={{
                onChange: (_e, value) =>
                  stateDispatch({ type: 'setFilterType', payload: value }),
                value: filterType,
                items: [
                  {
                    filterValues: {
                      items: [
                        {
                          value: 'Approval Pending',
                          label: 'Approval Pending'
                        },
                        {
                          value: 'Canceled',
                          label: 'Canceled'
                        },
                        {
                          value: 'Completed',
                          label: 'Completed'
                        },
                        {
                          value: 'Created',
                          label: 'Created'
                        },
                        {
                          value: 'Failed',
                          label: 'Failed'
                        },
                        {
                          value: 'Ordered',
                          label: 'Ordered'
                        }
                      ],
                      value: filters.state,
                      onChange: (_e, value) => handleFilterItems(value)
                    },
                    label: 'State',
                    value: 'state',
                    type: 'checkbox'
                  },
                  {
                    filterValues: {
                      value: filters.owner,
                      onChange: (_e, value) => handleFilterItems(value)
                    },
                    label: 'Owner',
                    value: 'owner'
                  }
                ]
              }}
              pagination={
                <AsyncPagination
                  isDisabled={isFetching || isFiltering}
                  apiRequest={handlePagination}
                  meta={meta}
                  isCompact
                />
              }
            />
          )}
          <Table aria-label="order-list">
            <Tbody>
              {isFetching || isFiltering ? (
                <tr>
                  <td className="pf-u-p-0">
                    <ListLoader />
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((item, index) => (
                  <OrderItem key={item.id} index={index} item={item} />
                ))
              ) : (
                <tr>
                  <td>
                    <EmptyTable>
                      <Bullseye>
                        <EmptyState>
                          <Bullseye>
                            <EmptyStateIcon icon={SearchIcon} />
                          </Bullseye>
                          <Title size="lg">
                            {meta.noData ? 'No orders' : 'No results found'}
                          </Title>
                          <EmptyStateBody>
                            {meta.noData
                              ? 'No orders have been created.'
                              : 'No results match the filter criteria. Remove all filters or clear all filters to show results.'}
                          </EmptyStateBody>

                          <EmptyStateSecondaryActions>
                            {!meta.noData && (
                              <Button
                                variant="link"
                                onClick={() => {
                                  stateDispatch({
                                    type: 'setFilteringFlag',
                                    payload: true
                                  });
                                  handleFilterItems('');
                                }}
                              >
                                Clear all filters
                              </Button>
                            )}
                          </EmptyStateSecondaryActions>
                        </EmptyState>
                      </Bullseye>
                    </EmptyTable>
                  </td>
                </tr>
              )}
            </Tbody>
          </Table>
          <TableToolbar>
            <div className="bottom-pagination-container">
              <Flex breakpointMods={[{ modifier: 'justify-content-flex-end' }]}>
                {meta.count > 0 && (
                  <AsyncPagination
                    className="pf-u-mt-0"
                    isDisabled={isFetching || isFiltering}
                    apiRequest={handlePagination}
                    meta={meta}
                  />
                )}
              </Flex>
            </div>
          </TableToolbar>
        </Section>
      </GridItem>
    </Grid>
  );
};

export default OrdersList;
