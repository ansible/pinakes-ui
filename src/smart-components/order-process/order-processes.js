import React, { Fragment, useEffect, useReducer } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  Button,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import { sortable } from '@patternfly/react-table';
import {
  fetchOrderProcesses,
  sortOrderProcesses,
  setFilterValueOrderProcesses
} from '../../redux/actions/order-process-actions';
import { createRows } from './order-process-table-helpers';
import { TableToolbarView } from '../../presentational-components/shared/table-toolbar-view';
import TopToolbar from '../../presentational-components/shared/top-toolbar';
import { defaultSettings } from '../../helpers/shared/pagination';
import asyncFormValidator from '../../utilities/async-form-validator';
import { scrollToTop } from '../../helpers/shared/helpers';
import TableEmptyState from '../../presentational-components/shared/table-empty-state';
import { useIntl } from 'react-intl';
import orderProcessesMessages from '../../messages/order-processes.messages';
import tableToolbarMessages from '../../messages/table-toolbar.messages';

const columns = (intl) => [
  {
    title: intl.formatMessage(tableToolbarMessages.name),
    transforms: [sortable]
  },
  {
    title: intl.formatMessage(orderProcessesMessages.description),
    transforms: [sortable]
  },
  {
    title: intl.formatMessage(orderProcessesMessages.created_at),
    transforms: [sortable]
  }
];

const debouncedFilter = asyncFormValidator(
  (filter, dispatch, filteringCallback, meta = defaultSettings) => {
    filteringCallback(true);
    dispatch(setFilterValueOrderProcesses(filter, meta));
    return dispatch(fetchOrderProcesses(meta)).then(() =>
      filteringCallback(false)
    );
  },
  1000
);

const prepareChips = (filterValue, intl) =>
  filterValue
    ? [
        {
          category: intl.formatMessage(tableToolbarMessages.name),
          key: 'name',
          chips: [{ name: filterValue, value: filterValue }]
        }
      ]
    : [];

const initialState = (filterValue = '') => ({
  filterValue,
  isOpen: false,
  isFetching: true,
  isFiltering: false
});

const orderProcessesState = (state, action) => {
  switch (action.type) {
    case 'setFetching':
      return { ...state, isFetching: action.payload };
    case 'setFilterValue':
      return { ...state, filterValue: action.payload };
    case 'setFilteringFlag':
      return { ...state, isFiltering: action.payload };
    default:
      return state;
  }
};

const OrderProcesses = () => {
  const {
    orderProcesses: { data, meta },
    sortBy,
    filterValueRedux
  } = useSelector(
    ({
      orderProcessReducer: {
        orderProcesses,
        sortBy,
        filterValue: filterValueRedux
      }
    }) => ({ orderProcesses, sortBy, filterValueRedux }),
    shallowEqual
  );
  const [{ filterValue, isFetching, isFiltering }, stateDispatch] = useReducer(
    orderProcessesState,
    initialState(filterValueRedux)
  );

  const dispatch = useDispatch();
  const intl = useIntl();

  const updateOrderProcesses = (pagination) => {
    stateDispatch({ type: 'setFetching', payload: true });
    return dispatch(fetchOrderProcesses(pagination))
      .then(() => stateDispatch({ type: 'setFetching', payload: false }))
      .catch(() => stateDispatch({ type: 'setFetching', payload: false }));
  };

  useEffect(() => {
    updateOrderProcesses(defaultSettings);
    scrollToTop();
  }, []);

  const handleFilterChange = (value) => {
    stateDispatch({ type: 'setFilterValue', payload: value });
    debouncedFilter(
      value,
      dispatch,
      (isFiltering) =>
        stateDispatch({ type: 'setFilteringFlag', payload: isFiltering }),
      { ...meta, offset: 0 }
    );
  };

  const onSort = (_e, index, direction, { property }) => {
    dispatch(sortOrderProcesses({ index, direction, property }));
    return updateOrderProcesses();
  };

  return (
    <Fragment>
      <TopToolbar>
        <TextContent className="pf-u-ml-md">
          <Text component={TextVariants.h1}>
            {intl.formatMessage(orderProcessesMessages.title)}
          </Text>
        </TextContent>
      </TopToolbar>
      <TableToolbarView
        sortBy={sortBy}
        onSort={onSort}
        data={data}
        createRows={createRows}
        columns={columns(intl)}
        fetchData={updateOrderProcesses}
        titlePlural={intl.formatMessage(orderProcessesMessages.orderProcesses)}
        titleSingular={intl.formatMessage(orderProcessesMessages.orderProcess)}
        pagination={meta}
        filterValue={filterValue}
        onFilterChange={handleFilterChange}
        isLoading={isFetching || isFiltering}
        renderEmptyState={() => (
          <TableEmptyState
            title={
              filterValue === ''
                ? intl.formatMessage(orderProcessesMessages.noOrderProcesses)
                : intl.formatMessage(tableToolbarMessages.noResultsFound)
            }
            Icon={SearchIcon}
            PrimaryAction={() =>
              filterValue !== '' ? (
                <Button onClick={() => handleFilterChange('')} variant="link">
                  {intl.formatMessage(tableToolbarMessages.clearAllFilters)}
                </Button>
              ) : null
            }
            description={
              filterValue === ''
                ? intl.formatMessage(orderProcessesMessages.noOrderProcesses)
                : intl.formatMessage(
                    tableToolbarMessages.clearAllFiltersDescription
                  )
            }
          />
        )}
        activeFiltersConfig={{
          filters: prepareChips(filterValue, intl),
          onDelete: () => handleFilterChange('')
        }}
      />
    </Fragment>
  );
};

export default OrderProcesses;
