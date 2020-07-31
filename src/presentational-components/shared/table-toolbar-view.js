import React, { Fragment, useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import {
  defaultSettings,
  getCurrentPage,
  getNewPage
} from '../../helpers/shared/pagination';
import { ListLoader } from './loader-placeholders';
import { useIntl } from 'react-intl';
import { Section } from '@redhat-cloud-services/frontend-components/components/cjs/Section';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/components/cjs/PrimaryToolbar';
import orderProcessesMessages from '../../messages/order-processes.messages';

export const TableToolbarView = ({
  isSelectable,
  createRows,
  columns,
  fetchData,
  toolbarButtons,
  data,
  actionResolver,
  routes,
  plural,
  pagination,
  setCheckedItems,
  filterValue,
  onFilterChange,
  isLoading,
  renderEmptyState,
  sortBy,
  onSort,
  activeFiltersConfig,
  filterConfig
}) => {
  const intl = useIntl();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(createRows(data));
  }, [data]);

  const setSelected = (_event, selected, index, { id } = {}) => {
    const newData = rows.map((row) =>
      row.id === id || index === -1
        ? {
            ...row,
            selected: index === -1 ? selected : !row.selected
          }
        : {
            ...row
          }
    );

    const checkedItems = newData.filter((item) => item.id && item.selected);
    setCheckedItems(checkedItems);
    return setRows(newData);
  };

  const paginationConfig = {
    itemCount: pagination.count,
    page: getCurrentPage(pagination.limit, pagination.offset),
    perPage: pagination.limit,
    onSetPage: (_e, page) =>
      fetchData({ ...pagination, offset: getNewPage(page, pagination.limit) }),
    onPerPageSelect: (_e, size) => fetchData({ ...pagination, limit: size }),
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
    <Section type="content" page-type={`tab-${plural}`} id={`tab-${plural}`}>
      {routes()}
      {renderToolbar(isLoading)}
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
              onSelect={isSelectable && setSelected}
              canSelectAll
            >
              <TableHeader />
              <TableBody />
            </Table>
          )}
          {pagination.count > 0 && (
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

TableToolbarView.propTypes = {
  isSelectable: propTypes.bool,
  createRows: propTypes.func.isRequired,
  columns: propTypes.array.isRequired,
  toolbarButtons: propTypes.func,
  fetchData: propTypes.func.isRequired,
  data: propTypes.array,
  pagination: propTypes.shape({
    limit: propTypes.number,
    offset: propTypes.number,
    count: propTypes.number
  }),
  plural: propTypes.string,
  singular: propTypes.string,
  routes: propTypes.func,
  actionResolver: propTypes.func,
  filterValue: propTypes.string,
  onFilterChange: propTypes.func,
  isLoading: propTypes.bool,
  renderEmptyState: propTypes.func,
  sortBy: propTypes.object,
  onSort: propTypes.func,
  activeFiltersConfig: propTypes.object,
  filterConfig: propTypes.array
};

TableToolbarView.defaultProps = {
  requests: [],
  isLoading: false,
  pagination: defaultSettings,
  isSelectable: null,
  routes: () => null,
  renderEmptyState: () => null,
  filterConfig: []
};
