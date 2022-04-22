import React, { Fragment } from 'react';
import propTypes from 'prop-types';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import { defaultSettings } from '../../helpers/shared/pagination';
import { DataListLoader } from './approval-loader-placeholders';
import { useIntl } from 'react-intl';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/PrimaryToolbar';

import tableToolbarMessages from '../../messages/table-toolbar.messages';
import { PageSection } from '@patternfly/react-core';

/**
 * Need to optimize this component
 * There is 7 renders before first table render
 * Should be just 2 - Loader -> Table
 */

export const TableToolbarView = ({
  columns,
  fetchData,
  toolbarButtons,
  actionResolver,
  routes,
  titlePlural,
  titleSingular,
  pagination,
  setLimit,
  setOffset,
  filterValue,
  onFilterChange,
  isLoading,
  renderEmptyState,
  sortBy,
  onSort,
  activeFiltersConfig,
  filterConfig,
  rows,
  ouiaId
}) => {
  const intl = useIntl();

  const paginationConfig = {
    itemCount: pagination.count,
    page: pagination.offset || 1,
    perPage: pagination.limit,
    onSetPage: (_e, page) => {
      setOffset(page || 1);
      return fetchData({ ...pagination, offset: page });
    },
    onPerPageSelect: (_e, size) => {
      setLimit(size);
      return fetchData({ ...pagination, limit: size });
    },
    isDisabled: isLoading
  };

  const renderToolbar = () => (
    <PrimaryToolbar
      className="pf-u-p-lg ins__approval__primary_toolbar"
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
            label: intl.formatMessage(tableToolbarMessages.name),
            filterValues: {
              id: 'filter-by-name',
              placeholder: intl.formatMessage(
                tableToolbarMessages.filterByTitle,
                { title: titleSingular }
              ),
              'aria-label': intl.formatMessage(
                tableToolbarMessages.filterByTitle,
                { title: titleSingular }
              ),
              onChange: (_event, value) => onFilterChange(value),
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
    <PageSection page-type={`tab-${titlePlural}`} id={`tab-${titlePlural}`}>
      {routes()}
      {(rows.length !== 0 || activeFiltersConfig?.filters?.length > 0) &&
        renderToolbar(isLoading)}
      {isLoading && <DataListLoader />}
      {!isLoading && rows.length === 0 ? (
        renderEmptyState()
      ) : (
        <Fragment>
          {!isLoading && (
            <Table
              aria-label={intl.formatMessage(tableToolbarMessages.ariaLabel, {
                title: titlePlural
              })}
              rows={rows}
              cells={columns}
              actionResolver={actionResolver}
              className="pf-u-pt-0 vertical-align-inherit"
              sortBy={sortBy}
              onSort={onSort}
              ouiaId={ouiaId}
            >
              <TableHeader />
              <TableBody />
            </Table>
          )}
          {pagination.count > 0 && (
            <PrimaryToolbar
              className="pf-u-pl-lg pf-u-pr-lg ins__approval__primary_toolbar"
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
    </PageSection>
  );
};

TableToolbarView.propTypes = {
  columns: propTypes.array.isRequired,
  toolbarButtons: propTypes.func,
  fetchData: propTypes.func.isRequired,
  pagination: propTypes.shape({
    limit: propTypes.number,
    offset: propTypes.number,
    count: propTypes.number
  }),
  setLimit: propTypes.func,
  setOffset: propTypes.func,
  titlePlural: propTypes.string,
  titleSingular: propTypes.string,
  routes: propTypes.func,
  actionResolver: propTypes.func,
  filterValue: propTypes.string,
  onFilterChange: propTypes.func,
  isLoading: propTypes.bool,
  renderEmptyState: propTypes.func,
  sortBy: propTypes.object,
  onSort: propTypes.func,
  activeFiltersConfig: propTypes.object,
  filterConfig: propTypes.array,
  rows: propTypes.array,
  ouiaId: propTypes.string
};

TableToolbarView.defaultProps = {
  requests: [],
  isLoading: false,
  pagination: defaultSettings,
  routes: () => null,
  renderEmptyState: () => null,
  filterConfig: []
};
