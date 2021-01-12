import React, { useEffect, useReducer } from 'react';
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
import {
  Chip,
  PrimaryToolbar
} from '@redhat-cloud-services/frontend-components/components/cjs/PrimaryToolbar';
import { EmptyTable } from '@redhat-cloud-services/frontend-components/components/cjs/EmptyTable';
import { TableToolbar } from '@redhat-cloud-services/frontend-components/components/cjs/TableToolbar';
import { SearchIcon } from '@patternfly/react-icons';
import {
  Table,
  TableHeader,
  TableBody,
  sortable,
  SortByDirection,
  ISortBy,
  OnSort,
  ICell
} from '@patternfly/react-table';

import { fetchOrders } from '../../redux/actions/order-actions';
import { fetchPlatforms } from '../../redux/actions/platform-actions';
import { ListLoader } from '../../presentational-components/shared/loader-placeholders';
import createOrderItem from './order-item';
import AsyncPagination from '../common/async-pagination';
import asyncFormValidator from '../../utilities/async-form-validator';
import {
  defaultSettings,
  PaginationConfiguration
} from '../../helpers/shared/pagination';
import useInitialUriHash from '../../routing/use-initial-uri-hash';
import statesMessages from '../../messages/states.messages';
import filteringMessages from '../../messages/filtering.messages';
import ordersMessages from '../../messages/orders.messages';
import labelMessages from '../../messages/labels.messages';
import useFormatMessage from '../../utilities/use-format-message';
import {
  getOrderPlatformId,
  getOrderPortfolioName
} from '../../helpers/shared/orders';
import { CatalogRootState } from '../../types/redux';
import {
  ApiCollectionResponse,
  Full,
  StringObject
} from '../../types/common-types';
import { PortfolioItem } from '@redhat-cloud-services/catalog-client';
import { OrderDetail } from '../../redux/reducers/order-reducer';

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
  },
  sortBy: {
    index: 0,
    direction: SortByDirection.desc
  }
};

const changeFilters = (
  value: string,
  type: string,
  filters: StringObject
): StringObject => ({
  ...filters,
  [type]: value
});

interface OrdersListState {
  isFetching?: boolean;
  filters: StringObject;
  filterType: string;
  isFiltering?: boolean;
  sortBy: Full<ISortBy>;
}
const ordersListState = (
  state: OrdersListState,
  action: { type: string; payload: any }
): OrdersListState => {
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
    case 'setSortBy':
      return { ...state, sortBy: action.payload, isFetching: true };
  }

  return state;
};

const sortIndexMapper = {
  0: 'id',
  3: 'owner',
  4: 'created_at',
  6: 'state'
};

const OrdersList: React.ComponentType = () => {
  const formatMessage = useFormatMessage();
  const dispatch = useDispatch();
  const viewState = useInitialUriHash();
  const [
    { isFetching, isFiltering, filterType, filters, sortBy },
    stateDispatch
  ] = useReducer(ordersListState, {
    ...initialState,
    filters: viewState?.orders?.filters || { state: [], owner: '' },
    sortBy: {
      direction: viewState?.orders?.sortDirection || SortByDirection.desc,
      index: viewState?.orders?.sortIndex || 0
    }
  });
  const { data, meta } = useSelector<
    CatalogRootState,
    ApiCollectionResponse<OrderDetail>
  >(({ orderReducer }) => orderReducer.orders);
  const columns: ICell[] = [
    { title: formatMessage(ordersMessages.orderID) },
    formatMessage(labelMessages.product),
    '', // need empty row column to correctly align product names after the icon column
    {
      title: formatMessage(ordersMessages.orderedByLabel)
    },
    { title: formatMessage(ordersMessages.orderDate) },
    formatMessage(labelMessages.updated),
    { title: formatMessage(labelMessages.status) }
  ].map((column) =>
    typeof column === 'object' &&
    !isFetching &&
    !isFiltering &&
    data.length !== 0
      ? { ...column, transforms: [sortable] }
      : column
  ) as ICell[];
  const portfolioItems = useSelector<CatalogRootState, Full<PortfolioItem>[]>(
    ({
      portfolioReducer: {
        portfolioItems: { data }
      }
    }) => data as Full<PortfolioItem>[]
  );
  const onSort: OnSort = (_e, index, direction) => {
    stateDispatch({
      type: 'setSortBy',
      payload: { index, direction }
    });
    return ((dispatch(
      fetchOrders(filters, {
        ...meta,
        sortBy: sortIndexMapper[index as keyof typeof sortIndexMapper],
        sortDirection: direction,
        sortIndex: index
      })
    ) as unknown) as Promise<void>).then(() =>
      stateDispatch({ type: 'setFetching', payload: false })
    );
  };

  const rows = data.map((item) => {
    const { orderPlatform, orderPortfolio } = getOrderPlatformId(
      item,
      portfolioItems
    );
    const orderName = getOrderPortfolioName(item, portfolioItems);
    return createOrderItem(
      { ...item, orderName },
      orderPlatform,
      orderPortfolio,
      formatMessage
    );
  });

  useEffect(() => {
    stateDispatch({ type: 'setFetching', payload: true });
    Promise.all([
      dispatch(fetchOrders(filters, viewState?.orders)),
      dispatch(fetchPlatforms())
    ]).then(() => stateDispatch({ type: 'setFetching', payload: false }));
  }, []);

  const handlePagination = (
    _apiProps: any,
    pagination: PaginationConfiguration
  ) => {
    stateDispatch({ type: 'setFetching', payload: true });
    return ((dispatch(
      fetchOrders(filters, {
        ...pagination,
        sortBy: sortIndexMapper[sortBy.index as keyof typeof sortIndexMapper],
        sortDirection: sortBy.direction as SortByDirection,
        sortIndex: sortBy.index
      })
    ) as unknown) as Promise<void>)
      .then(() => stateDispatch({ type: 'setFetching', payload: false }))
      .catch(() => stateDispatch({ type: 'setFetching', payload: false }));
  };

  const handleFilterItems = (value = '') => {
    stateDispatch({ type: 'setFilterValue', payload: value });
    debouncedFilter(
      { ...filters, [filterType]: value },
      {
        ...meta,
        sortBy: sortIndexMapper[sortBy.index as keyof typeof sortIndexMapper],
        sortDirection: sortBy.direction,
        sortIndex: sortBy.index,
        offset: 0
      },
      dispatch,
      (isFiltering: boolean) =>
        stateDispatch({ type: 'setFilteringFlag', payload: isFiltering })
    );
  };

  const handleClearAll = () => {
    stateDispatch({
      type: 'replaceFilterChip',
      payload: initialState.filters
    });
    return debouncedFilter(
      initialState.filters,
      {
        ...meta,
        sortBy: sortIndexMapper[sortBy.index as keyof typeof sortIndexMapper],
        sortDirection: sortBy.direction,
        sortIndex: sortBy.index
      },
      dispatch,
      (isFiltering: boolean) =>
        stateDispatch({
          type: 'setFilteringFlag',
          payload: isFiltering
        })
    );
  };

  return (
    <Grid hasGutter>
      <GridItem>
        <Section type="content">
          {!meta.noData && (
            <PrimaryToolbar
              activeFiltersConfig={{
                filters: Object.entries(filters)
                  .filter(([, value]) => value && value.length > 0)
                  .map<{ category: string; type: string; chips: Chip[] }>(
                    ([key, value]) => ({
                      category: key,
                      type: key,
                      chips: Array.isArray(value)
                        ? value.map<Chip>((name) => ({ name }))
                        : ([{ name: value }] as Chip[])
                    })
                  ),
                onDelete: (_e, [chip], clearAll) => {
                  if (clearAll) {
                    return handleClearAll();
                  }

                  const newFilters = { ...filters };
                  if (chip.type === 'state') {
                    newFilters[chip.type] = (((newFilters[
                      chip.type
                    ] as unknown) as string[]).filter(
                      (value) => value !== chip?.chips?.[0].name
                    ) as unknown) as string;
                  } else {
                    newFilters[chip.type!] = '';
                  }

                  stateDispatch({
                    type: 'replaceFilterChip',
                    payload: newFilters
                  });
                  debouncedFilter(
                    newFilters,
                    meta,
                    dispatch,
                    (isFiltering: boolean) =>
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
                          label: formatMessage(statesMessages.approvalPending)
                        },
                        {
                          value: 'Canceled',
                          label: formatMessage(statesMessages.canceled)
                        },
                        {
                          value: 'Completed',
                          label: formatMessage(statesMessages.completed)
                        },
                        {
                          value: 'Created',
                          label: formatMessage(labelMessages.created)
                        },
                        {
                          value: 'Failed',
                          label: formatMessage(statesMessages.failed)
                        },
                        {
                          value: 'Ordered',
                          label: formatMessage(statesMessages.ordered)
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
          <Table
            aria-label="orders"
            {...(!(isFetching || isFiltering) && data.length === 0
              ? {}
              : { sortBy, onSort })}
            cells={columns}
            rows={isFetching || isFiltering ? [] : rows}
            className="orders-table"
          >
            <TableHeader />
            <TableBody />
          </Table>
          {!(isFetching || isFiltering) && data.length === 0 && (
            <EmptyTable>
              <Bullseye>
                <EmptyState>
                  <Bullseye>
                    <EmptyStateIcon icon={SearchIcon} />
                  </Bullseye>
                  <Title headingLevel="h1" size="lg">
                    {meta.noData
                      ? formatMessage(ordersMessages.noOrdersTitle)
                      : formatMessage(filteringMessages.noResults)}
                  </Title>
                  <EmptyStateBody>
                    {meta.noData
                      ? formatMessage(ordersMessages.noOrdersDescription)
                      : formatMessage(filteringMessages.noResultsDescription)}
                  </EmptyStateBody>
                  {!meta.noData && (
                    <EmptyStateSecondaryActions>
                      <Button
                        ouiaId={'clear-filter'}
                        variant="link"
                        onClick={handleClearAll}
                      >
                        {formatMessage(filteringMessages.clearFilters)}
                      </Button>
                    </EmptyStateSecondaryActions>
                  )}
                </EmptyState>
              </Bullseye>
            </EmptyTable>
          )}
          {(isFetching || isFiltering) && <ListLoader />}
          <TableToolbar className="pf-u-mr-0">
            <div className="bottom-pagination-container">
              <Flex justifyContent={{ default: 'justifyContentFlexEnd' }}>
                {meta && meta.count! > 0 && (
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
