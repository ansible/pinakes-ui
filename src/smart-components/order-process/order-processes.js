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
import { sortable, cellWidth } from '@patternfly/react-table';
import {
  fetchOrderProcesses,
  sortOrderProcesses
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
import {
  ADD_ORDER_PROCESS_ROUTE,
  REMOVE_ORDER_PROCESS_ROUTE,
  UPDATE_ORDER_PROCESS_ROUTE
} from '../../constants/routes';
import AddOrderProcess from './add-order-process-modal';
import useInitialUriHash from '../../routing/use-initial-uri-hash';
import RemoveOrderProcess from './remove-order-process-modal';
import actionMessages from '../../messages/actions.messages';
import OrderProcessTableContext from './order-process-table-context';
import { Checkbox } from '@patternfly/react-core';
import useEnhancedHistory from '../../utilities/use-enhanced-history';

const columns = (intl, allSelected, selectAll) => [
  {
    title: (
      <Checkbox onChange={selectAll} isChecked={allSelected} id="select-all" />
    ),
    transforms: [cellWidth(1)]
  },
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
  (filter, dispatch, filteringCallback, meta = defaultSettings, sortBy) => {
    filteringCallback(true);
    return dispatch(
      fetchOrderProcesses({ filterValue: filter, ...meta, sortBy })
    ).then(() => filteringCallback(false));
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

const initialState = {
  filter: '',
  isFetching: true,
  isFiltering: false,
  selectedOrderProcesses: [],
  allSelected: false,
  rows: []
};

const areAllSelected = (rows = [], selected) =>
  rows.every((row) => selected.includes(row.id));
const unique = (value, index, self) => self.indexOf(value) === index;

const orderProcessesState = (state, action) => {
  switch (action.type) {
    case 'setRows':
      return {
        ...state,
        rows: action.payload,
        allSelected: areAllSelected(
          action.payload,
          state.selectedOrderProcesses
        )
      };
    case 'setFetching':
      return {
        ...state,
        isFetching: action.payload
      };
    case 'setFilterValue':
      return { ...state, filterValue: action.payload };
    case 'select':
      return {
        ...state,
        allSelected: false,
        selectedOrderProcesses: state.selectedOrderProcesses.includes(
          action.payload
        )
          ? state.selectedOrderProcesses.filter((id) => id !== action.payload)
          : [...state.selectedOrderProcesses, action.payload]
      };
    case 'selectAll':
      return {
        ...state,
        selectedOrderProcesses: [
          ...state.selectedOrderProcesses,
          ...action.payload
        ].filter(unique),
        allSelected: true
      };
    case 'unselectAll':
      return {
        ...state,
        selectedOrderProcesses: state.selectedOrderProcesses.filter(
          (selected) => !action.payload.includes(selected)
        ),
        allSelected: false
      };
    case 'resetSelected':
      return {
        ...state,
        selectedOrderProceses: [],
        allSelected: false
      };
    case 'setFilteringFlag':
      return { ...state, isFiltering: action.payload };
    default:
      return state;
  }
};

const OrderProcesses = () => {
  const viewState = useInitialUriHash();
  const {
    orderProcesses: { data, meta },
    sortBy
  } = useSelector(
    ({ orderProcessReducer: { orderProcesses, sortBy } }) => ({
      orderProcesses,
      sortBy
    }),
    shallowEqual
  );
  const [
    {
      filterValue,
      isFetching,
      isFiltering,
      selectedOrderProcesses,
      allSelected,
      rows
    },
    stateDispatch
  ] = useReducer(orderProcessesState, {
    ...initialState,
    filterValue: viewState?.orderProcesses?.filter || initialState.filterValue
  });

  const dispatch = useDispatch();
  const intl = useIntl();
  const history = useEnhancedHistory({ keepHash: true });
  const setSelectedOrderProcesses = (id) =>
    stateDispatch({ type: 'select', payload: id });

  const updateOrderProcesses = (pagination) => {
    console.log('Debug - updateOrderProcesses sortBy', pagination?.sortBy);
    stateDispatch({ type: 'setFetching', payload: true });
    return dispatch(fetchOrderProcesses(pagination))
      .then(() => stateDispatch({ type: 'setFetching', payload: false }))
      .catch(() => stateDispatch({ type: 'setFetching', payload: false }));
  };

  useEffect(() => {
    insights.chrome.appNavClick({ id: 'order-processes', secondaryNav: true });
    updateOrderProcesses(
      viewState?.orderProcesses
        ? {
            ...viewState.orderProcesses,
            sortBy,
            filterValue
          }
        : defaultSettings
    );
    scrollToTop();
  }, []);

  useEffect(() => {
    stateDispatch({ type: 'setRows', payload: createRows(data) });
  }, [data]);

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
    <Fragment>
      <Route exact path={ADD_ORDER_PROCESS_ROUTE}>
        <AddOrderProcess postMethod={updateOrderProcesses} />
      </Route>
      <Route exact path={REMOVE_ORDER_PROCESS_ROUTE}>
        <RemoveOrderProcess
          ids={selectedOrderProcesses}
          fetchData={updateOrderProcesses}
          resetSelectedOrderProcesses={() =>
            stateDispatch({ type: 'resetSelected' })
          }
        />
      </Route>
      <Route exact path={UPDATE_ORDER_PROCESS_ROUTE}>
        <AddOrderProcess edit />
      </Route>
    </Fragment>
  );

  const actionResolver = () => [
    {
      title: intl.formatMessage(actionMessages.edit),
      onClick: (_event, _rowId, orderProcess) =>
        history.push({
          pathname: UPDATE_ORDER_PROCESS_ROUTE,
          search: `?order_process=${orderProcess.id}`
        })
    },
    {
      title: intl.formatMessage(actionMessages.delete),
      onClick: (_event, _rowId, orderProcess) =>
        history.push({
          pathname: REMOVE_ORDER_PROCESS_ROUTE,
          search: `?order_process=${orderProcess.id}`
        })
    }
  ];

  const doSelectAll = () => {
    return allSelected
      ? stateDispatch({ type: 'unselectAll', payload: data.map((op) => op.id) })
      : stateDispatch({ type: 'selectAll', payload: data.map((op) => op.id) });
  };

  const anyOrderProcessSelected = selectedOrderProcesses.length > 0;

  const onSort = (_e, index, direction, { property }) => {
    dispatch(sortOrderProcesses({ index, direction, property }));
    return updateOrderProcesses({
      ...meta,
      filterValue,
      sortBy: {
        index,
        direction,
        property
      }
    });
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
      <ToolbarItem>
        <Link
          id="remove-multiple-order-processes'"
          className={anyOrderProcessSelected ? '' : 'disabled-link'}
          to={{ pathname: REMOVE_ORDER_PROCESS_ROUTE }}
        >
          <Button
            variant="secondary"
            isDisabled={!anyOrderProcessSelected}
            aria-label={intl.formatMessage(
              orderProcessesMessages.deleteOrderProcess
            )}
          >
            {intl.formatMessage(actionMessages.delete)}
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
      <OrderProcessTableContext.Provider
        value={{ selectedOrderProcesses, setSelectedOrderProcesses }}
      >
        <TableToolbarView
          sortBy={sortBy}
          onSort={onSort}
          rows={rows}
          columns={columns(intl, allSelected, doSelectAll)}
          routes={routes}
          fetchData={updateOrderProcesses}
          titlePlural={intl.formatMessage(orderProcessesMessages.title)}
          titleSingular={intl.formatMessage(
            orderProcessesMessages.orderProcess
          )}
          pagination={meta}
          filterValue={filterValue}
          onFilterChange={handleFilterChange}
          isLoading={isFetching || isFiltering}
          toolbarButtons={toolbarButtons}
          actionResolver={actionResolver}
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
      </OrderProcessTableContext.Provider>
    </Fragment>
  );
};

export default OrderProcesses;
