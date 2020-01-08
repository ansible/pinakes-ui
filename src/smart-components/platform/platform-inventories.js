import React, { Fragment, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useParams, useHistory } from 'react-router-dom';
import { SearchIcon } from '@patternfly/react-icons';
import { Section } from '@redhat-cloud-services/frontend-components';
import { scrollToTop } from '../../helpers/shared/helpers';
import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import { defaultSettings } from '../../helpers/shared/pagination';
import {
  fetchPlatformInventories,
  fetchSelectedPlatform
} from '../../redux/actions/platform-actions';
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

const initialState = {
  filterValue: '',
  isOpen: false,
  isFetching: true,
  isFiltering: false
};

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
  const { id } = useParams();
  const history = useHistory();

  const debouncedFilter = asyncFormValidator(
    (value, dispatch, filteringCallback, meta = defaultSettings) => {
      filteringCallback(true);
      dispatch(fetchPlatformInventories(id, value, meta)).then(() =>
        filteringCallback(false)
      );
    },
    1000
  );

  const tabItems = [
    {
      eventKey: 0,
      title: 'Templates',
      name: `/platforms/detail/${id}/platform-templates`
    },
    {
      eventKey: 1,
      title: 'Inventories',
      name: `/platforms/detail/${id}/platform-inventories`
    }
  ];

  useEffect(() => {
    dispatch(fetchSelectedPlatform(id));
    dispatch(
      fetchPlatformInventories(id, filterValue, defaultSettings)
    ).then(() => stateDispatch({ type: 'setFetching', payload: false }));
    scrollToTop();
  }, []);

  const handleFilterChange = (value) => {
    stateDispatch({ type: 'setFilterValue', payload: value });
    debouncedFilter(
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
          history.push(
            `/platforms/detail/${id}/platform-inventories/edit-workflow/${inventoryData.id}`
          )
      }
    ];
  };

  const renderItems = () => {
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
            meta,
            apiRequest: (_, options) =>
              dispatch(fetchPlatformInventories(id, filterValue, options))
          })}
        />
        <Route path="/platforms/detail/:id/platform-inventories/edit-workflow/:resourceId">
          <EditApprovalWorkflow
            closeUrl={`/platforms/detail/${id}/platform-inventories`}
            objectType={INVENTORY_RESOURCE_TYPE}
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
          <div className="pf-u-p-lg global-primary-background pf-u-mt-auto">
            <AsyncPagination
              dropDirection="up"
              meta={meta}
              apiRequest={(_, options) =>
                dispatch(fetchPlatformInventories(id, filterValue, options))
              }
            />
          </div>
        )}
      </Fragment>
    );
  };

  return (
    <Switch>
      <Route
        path={'/platforms/detail/:id/platform-inventories'}
        render={renderItems}
      />
    </Switch>
  );
};

PlatformInventories.propTypes = {
  isPlatformDataLoading: PropTypes.bool,
  platform: PropTypes.shape({
    name: PropTypes.string
  }),
  title: PropTypes.string,
  platformInventories: PropTypes.arrayOf(PropTypes.shape({})),
  paginationCurrent: PropTypes.shape({
    limit: PropTypes.number.isRequired,
    offset: PropTypes.number.isRequired,
    count: PropTypes.number
  })
};

PlatformInventories.defaultProps = {
  platformItems: [],
  paginationCurrent: {
    limit: 50,
    offset: 0
  }
};

export default PlatformInventories;
