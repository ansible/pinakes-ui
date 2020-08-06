import React, { Fragment, useEffect, useReducer } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Link, Route } from 'react-router-dom';
import {
  Button,
  Text,
  TextContent,
  TextVariants,
  ToolbarItem
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
import filteringMessages from '../../messages/filtering.messages';
import labelMessages from '../../messages/labels.messages';
import { StyledToolbarGroup } from '../../presentational-components/styled-components/toolbars';
import { ADD_ORDER_PROCESS_ROUTE } from '../../constants/routes';
import AddOrderProcess from './add-order-process-modal';

const columns = (intl) => [
  {
    title: intl.formatMessage(labelMessages.name),
    transforms: [sortable]
  },
  {
    title: intl.formatMessage(labelMessages.description),
    transforms: [sortable]
  },
  {
    title: intl.formatMessage(labelMessages.created),
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
          category: intl.formatMessage(labelMessages.name),
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
    insights.chrome.appNavClick({ id: 'order-processes', secondaryNav: true });
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

  const routes = () => (
    <Route
      exact
      path={ADD_ORDER_PROCESS_ROUTE}
      render={(props) => (
        <AddOrderProcess {...props} postMethod={updateOrderProcesses} />
      )}
    />
  );

  const onSort = (_e, index, direction, { property }) => {
    dispatch(sortOrderProcesses({ index, direction, property }));
    return updateOrderProcesses();
  };

  const toolbarButtons = () => (
    <StyledToolbarGroup className="pf-u-pl-lg top-toolbar">
      <ToolbarItem>
        <Link
          id="add-order-process-link"
          to={{ pathname: ADD_ORDER_PROCESS_ROUTE }}
        >
          <Button
            variant="primary"
            aria-label={intl.formatMessage(labelMessages.create)}
          >
            {intl.formatMessage(labelMessages.create)}
          </Button>
        </Link>
      </ToolbarItem>
    </StyledToolbarGroup>
  );

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
        routes={routes}
        columns={columns(intl)}
        fetchData={updateOrderProcesses}
        titlePlural={intl.formatMessage(orderProcessesMessages.title)}
        titleSingular={intl.formatMessage(orderProcessesMessages.orderProcess)}
        pagination={meta}
        filterValue={filterValue}
        onFilterChange={handleFilterChange}
        isLoading={isFetching || isFiltering}
        toolbarButtons={toolbarButtons}
        renderEmptyState={() => (
          <TableEmptyState
            title={
              filterValue === ''
                ? intl.formatMessage(orderProcessesMessages.noOrderProcesses)
                : intl.formatMessage(filteringMessages.noResultsFound)
            }
            Icon={SearchIcon}
            PrimaryAction={() =>
              filterValue !== '' ? (
                <Button onClick={() => handleFilterChange('')} variant="link">
                  {intl.formatMessage(filteringMessages.clearFilters)}
                </Button>
              ) : null
            }
            description={
              filterValue === ''
                ? intl.formatMessage(orderProcessesMessages.noOrderProcesses)
                : intl.formatMessage(filteringMessages.noResultsDescription)
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
