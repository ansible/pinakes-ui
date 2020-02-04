import React, { Fragment, useEffect, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, useHistory } from 'react-router-dom';
import { SearchIcon } from '@patternfly/react-icons';
import { Section } from '@redhat-cloud-services/frontend-components';
import { scrollToTop } from '../../helpers/shared/helpers';
import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import { defaultSettings } from '../../helpers/shared/pagination';
import { fetchPlatformInventories } from '../../redux/actions/platform-actions';
import {
  createPlatformsFilterToolbarSchema,
  createPlatformsTopToolbarSchema
} from '../../toolbar/schemas/platforms-toolbar.schema';
import ContentGaleryEmptyState from '../../presentational-components/shared/content-gallery-empty-state';
import asyncFormValidator from '../../utilities/async-form-validator';
import ContentList from '../../presentational-components/shared/content-list';
import { createRows } from './platform-table-helpers.js';
import EditApprovalWorkflow from '../common/edit-approval-workflow';
import { INVENTORY_RESOURCE_TYPE } from '../../utilities/constants';
import AsyncPagination from '../common/async-pagination';
import BottomPaginationContainer from '../../presentational-components/shared/bottom-pagination-container';
import useQuery from '../../utilities/use-query';

const initialState = {
  filterValue: '',
  isOpen: false,
  isFetching: true,
  isFiltering: false
};

const debouncedFilter = asyncFormValidator(
  (id, value, dispatch, filteringCallback, meta = defaultSettings) => {
    filteringCallback(true);
    dispatch(fetchPlatformInventories(id, value, meta)).then(() =>
      filteringCallback(false)
    );
  },
  1000
);

const platformInventoriesState = (state, action) => {
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

const columns = ['Name', 'Description', 'Created', 'Workflow'];

const PlatformInventories = () => {
  const [{ filterValue, isFetching, isFiltering }, stateDispatch] = useReducer(
    platformInventoriesState,
    initialState
  );
  const { data, meta } = useSelector(
    ({ platformReducer: { platformInventories } }) => platformInventories
  );
  const platform = useSelector(
    ({ platformReducer: { selectedPlatform } }) => selectedPlatform
  );
  const dispatch = useDispatch();
  const [{ platform: id }] = useQuery(['platform']);
  const history = useHistory();

  const tabItems = [
    {
      eventKey: 0,
      title: 'Templates',
      name: `/platform/platform-templates`
    },
    {
      eventKey: 1,
      title: 'Inventories',
      name: `/platform/platform-inventories`
    }
  ];

  useEffect(() => {
    dispatch(
      fetchPlatformInventories(id, filterValue, defaultSettings)
    ).then(() => stateDispatch({ type: 'setFetching', payload: false }));
    scrollToTop();
  }, []);

  const handleFilterChange = (value) => {
    stateDispatch({ type: 'setFilterValue', payload: value });
    debouncedFilter(
      id,
      value,
      dispatch,
      (isFiltering) =>
        stateDispatch({ type: 'setFilteringFlag', payload: isFiltering }),
      {
        ...meta,
        offset: 0
      }
    );
  };

  const actionResolver = (inventoryData) => {
    return [
      {
        title: 'Set approval',
        onClick: () =>
          history.push({
            pathname: '/platform/platform-inventories/edit-workflow',
            search: `?platform=${id}&inventory=${inventoryData.id}`
          })
      }
    ];
  };

  const objectName = (id) => {
    if (data) {
      return data.find((obj) => obj.id === id).name;
    }

    return 'inventory';
  };

  const inventoryRows = data ? createRows(data, filterValue) : [];
  const title = platform ? platform.name : '';
  return (
    <Fragment>
      <ToolbarRenderer
        schema={createPlatformsTopToolbarSchema({
          title,
          paddingBottom: false,
          tabItems
        })}
      />
      <ToolbarRenderer
        schema={createPlatformsFilterToolbarSchema({
          onFilterChange: handleFilterChange,
          searchValue: filterValue,
          filterPlaceholder: 'Filter by inventory...',
          meta,
          apiRequest: (_, options) =>
            dispatch(fetchPlatformInventories(id, filterValue, options))
        })}
      />
      <Route path="/platform/platform-inventories/edit-workflow">
        <EditApprovalWorkflow
          pushParam={{
            pathname: '/platform/platform-inventories',
            search: `?platform=${id}`
          }}
          objectType={INVENTORY_RESOURCE_TYPE}
          objectName={objectName}
          querySelector="inventory"
        />
      </Route>
      <Section type="content">
        <ContentList
          title={title}
          data={inventoryRows}
          columns={columns}
          isLoading={isFetching || isFiltering}
          actionResolver={actionResolver}
          renderEmptyState={() => (
            <ContentGaleryEmptyState
              title="No inventories"
              Icon={SearchIcon}
              description={
                filterValue === ''
                  ? 'No inventories found.'
                  : 'No inventories match your filter criteria.'
              }
            />
          )}
        />
      </Section>

      {meta.count > 0 && (
        <BottomPaginationContainer>
          <AsyncPagination
            dropDirection="up"
            meta={meta}
            apiRequest={(_, options) =>
              dispatch(fetchPlatformInventories(id, filterValue, options))
            }
          />
        </BottomPaginationContainer>
      )}
    </Fragment>
  );
};

export default PlatformInventories;
