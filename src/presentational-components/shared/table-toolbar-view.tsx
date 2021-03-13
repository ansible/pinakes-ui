/* eslint-disable react/prop-types */
import React, { Fragment, ReactNode } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  IActionsResolver,
  ISortBy,
  OnSort,
  IRow,
  ICell
} from '@patternfly/react-table';
import {
  defaultSettings,
  getCurrentPage,
  getNewPage,
  PaginationConfiguration
} from '../../helpers/shared/pagination';
import { ListLoader } from './loader-placeholders';
import { useIntl } from 'react-intl';
import { Section } from '@redhat-cloud-services/frontend-components/Section';
import {
  PrimaryToolbar,
  ActiveFiltersConfig,
  FilterItem
} from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import orderProcessesMessages from '../../messages/order-processes.messages';

export interface TableToolbarViewProps {
  columns: ICell[];
  toolbarButtons?: () => ReactNode;
  fetchData: (pagination: PaginationConfiguration) => Promise<any | void>;
  pagination?: PaginationConfiguration;
  plural?: string;
  singular?: string;
  routes?: () => ReactNode;
  actionResolver?: IActionsResolver;
  filterValue?: string;
  onFilterChange: (value?: string) => void;
  isLoading?: boolean;
  renderEmptyState?: () => ReactNode;
  sortBy?: ISortBy;
  onSort?: OnSort;
  activeFiltersConfig?: ActiveFiltersConfig;
  filterConfig?: FilterItem[];
  rows: IRow[];
  ouiaId?: string;
}
export const TableToolbarView: React.ComponentType<TableToolbarViewProps> = ({
  columns,
  fetchData,
  toolbarButtons,
  actionResolver,
  routes = () => null,
  plural,
  pagination = defaultSettings,
  filterValue,
  onFilterChange,
  isLoading = false,
  renderEmptyState = () => null,
  sortBy,
  onSort,
  activeFiltersConfig,
  filterConfig = [],
  rows,
  ouiaId
}) => {
  const intl = useIntl();

  const paginationConfig = {
    itemCount: pagination.count,
    page: getCurrentPage(pagination.limit, pagination.offset),
    perPage: pagination.limit,
    onSetPage: (_e: React.MouseEvent, page: number) =>
      fetchData({ ...pagination, offset: getNewPage(page, pagination.limit) }),
    onPerPageSelect: (_e: React.MouseEvent, size: number) =>
      fetchData({ ...pagination, limit: size }),
    isDisabled: isLoading
  };

  const renderToolbar = () => (
    <PrimaryToolbar
      className="pf-u-p-lg"
      pagination={paginationConfig}
      {...(toolbarButtons && {
        actionsConfig: {
          dropdownProps: {
            position: 'right'
          },
          actions: [toolbarButtons()]
        }
      })}
      filterConfig={{
        items: [
          {
            label: intl.formatMessage({
              id: 'name',
              defaultMessage: 'Name'
            }),
            filterValues: {
              id: 'filter-by-name',
              placeholder: intl.formatMessage(
                orderProcessesMessages.orderProcessesFilter
              ),
              'aria-label': intl.formatMessage(
                orderProcessesMessages.orderProcessesFilter
              ),
              onChange: (
                _event: React.SyntheticEvent<Element, Event>,
                value?: string
              ) => onFilterChange(value),
              value: filterValue
            }
          },
          ...filterConfig
        ]
      }}
      activeFiltersConfig={activeFiltersConfig}
    />
  );

  return (
    <Section type="content" page-type={`tab-${plural}`} id={`tab-${plural}`}>
      {routes()}
      {renderToolbar()}
      {isLoading && <ListLoader />}
      {!isLoading && rows.length === 0 ? (
        renderEmptyState()
      ) : (
        <Fragment>
          {!isLoading && (
            <Table
              aria-label={`${plural} table`}
              rows={rows}
              cells={columns}
              actionResolver={actionResolver}
              className="pf-u-pt-0"
              sortBy={sortBy}
              onSort={onSort}
              ouiaId={ouiaId}
            >
              <TableHeader />
              <TableBody />
            </Table>
          )}
          {pagination.count! > 0 && (
            <PrimaryToolbar
              className="pf-u-pl-lg pf-u-pr-lg"
              pagination={{
                ...paginationConfig,
                dropDirection: 'up',
                variant: 'bottom',
                isCompact: false,
                className: 'pf-u-pr-0'
              }}
            />
          )}
        </Fragment>
      )}
    </Section>
  );
};
