import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/PrimaryToolbar';

import AsyncPagination from '../../common/async-pagination';
import CatalogLink from '../../common/catalog-link';
import { Button } from '@patternfly/react-core';
import labelMessages from '../../../messages/labels.messages';
import useFormatMessage from '../../../utilities/use-format-message';

const chipCategories = {
  name: labelMessages.name,
  owner: labelMessages.owner,
  sort_by: labelMessages.sortBy
};

const sortByMapping = {
  name: labelMessages.name,
  owner: labelMessages.owner,
  updated_at: labelMessages.updated,
  created_at: labelMessages.created
};

const PortfoliosPrimaryToolbar = ({
  filters,
  stateDispatch,
  debouncedFilter,
  initialState,
  meta,
  filterType,
  handleFilterItems,
  sortDirection,
  handleSort,
  fetchPortfoliosWithState,
  isFetching,
  isFiltering,
  canCreate
}) => {
  const dispatch = useDispatch();
  const formatMessage = useFormatMessage();
  if (meta.noData) {
    return null;
  }

  return (
    <PrimaryToolbar
      {...(canCreate
        ? {
            dedicatedAction: (
              <CatalogLink pathname="/portfolios/add-portfolio">
                <Button
                  variant="primary"
                  id="create-portfolio"
                  ouiaId={'create-portfolio'}
                  type="button"
                >
                  {formatMessage(labelMessages.create)}
                </Button>
              </CatalogLink>
            )
          }
        : {})}
      activeFiltersConfig={{
        filters: Object.entries(filters)
          .filter(([, value]) => value && value.length > 0)
          .map(([key, value]) => {
            return {
              category: formatMessage(chipCategories[key]),
              type: key,
              chips: Array.isArray(value)
                ? value.map((name) => ({
                    name
                  }))
                : [
                    {
                      name:
                        key === 'sort_by'
                          ? formatMessage(sortByMapping[value])
                          : value
                    }
                  ]
            };
          }),
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
              value: filters.name,
              onChange: (_e, value) => handleFilterItems(value)
            },
            label: formatMessage(labelMessages.name),
            value: 'name'
          },
          {
            filterValues: {
              value: filters.owner,
              onChange: (_e, value) => handleFilterItems(value)
            },
            label: formatMessage(labelMessages.owner),
            value: 'owner'
          },
          {
            filterValues: {
              value: filters.sort_by || 'name',
              onChange: (_e, value) => handleFilterItems(value),
              items: [
                {
                  label: formatMessage(labelMessages.name),
                  value: 'name'
                },
                {
                  label: formatMessage(labelMessages.owner),
                  value: 'owner'
                },
                {
                  label: formatMessage(labelMessages.created),
                  value: 'created_at'
                },
                {
                  label: formatMessage(labelMessages.updated),
                  value: 'updated_at'
                }
              ]
            },
            placeholder: filters.sort_by
              ? formatMessage(sortByMapping[filters.sort_by])
              : formatMessage(labelMessages.name),
            label: formatMessage(labelMessages.sortBy),
            value: 'sort_by',
            type: 'radio'
          }
        ]
      }}
      sortByConfig={{
        direction: sortDirection,
        onSortChange: (_event, direction) => handleSort(direction)
      }}
      pagination={
        meta.count > 0 ? (
          <AsyncPagination
            isDisabled={isFetching || isFiltering}
            meta={meta}
            apiRequest={(_, options) =>
              dispatch(fetchPortfoliosWithState(filters, options))
            }
            isCompact
          />
        ) : (
          undefined
        )
      }
    />
  );
};

PortfoliosPrimaryToolbar.propTypes = {
  filters: PropTypes.shape({
    name: PropTypes.string.isRequired,
    owner: PropTypes.string.isRequired,
    sort_by: PropTypes.string
  }).isRequired,
  stateDispatch: PropTypes.func.isRequired,
  debouncedFilter: PropTypes.func.isRequired,
  initialState: PropTypes.shape({
    filters: PropTypes.shape({ [PropTypes.string]: PropTypes.any }).isRequired
  }).isRequired,
  meta: PropTypes.object.isRequired,
  filterType: PropTypes.string.isRequired,
  handleFilterItems: PropTypes.func.isRequired,
  sortDirection: PropTypes.string.isRequired,
  handleSort: PropTypes.func.isRequired,
  fetchPortfoliosWithState: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isFiltering: PropTypes.bool.isRequired,
  canCreate: PropTypes.bool
};

export default PortfoliosPrimaryToolbar;
