import React, { Fragment, useEffect, useReducer, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { SearchIcon } from '@patternfly/react-icons';
import { Section } from '@redhat-cloud-services/frontend-components/Section';
import { scrollToTop } from '../../helpers/shared/helpers';
import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import { defaultSettings } from '../../helpers/shared/pagination';
import { fetchPlatformInventories } from '../../redux/actions/platform-actions';
import { fetchPlatformInventories as fetchPlatformInventoriesS } from '../../redux/actions/platform-actions-s';
import { createPlatformsFilterToolbarSchema } from '../../toolbar/schemas/platforms-toolbar.schema';
import ContentGaleryEmptyState from '../../presentational-components/shared/content-gallery-empty-state';
import asyncFormValidator from '../../utilities/async-form-validator';
import ContentList from '../../presentational-components/shared/content-list';
import { createRows } from './platform-table-helpers.js';
import AsyncPagination from '../common/async-pagination';
import BottomPaginationContainer from '../../presentational-components/shared/bottom-pagination-container';
import useQuery from '../../utilities/use-query';
import labelMessages from '../../messages/labels.messages';
import platformsMessages from '../../messages/platforms.messages';
import useFormatMessage from '../../utilities/use-format-message';

const initialState = {
  filterValue: '',
  isOpen: false,
  isFetching: true,
  isFiltering: false
};

const debouncedFilter = asyncFormValidator(
  (id, value, dispatch, filteringCallback, meta = defaultSettings) => {
    filteringCallback(true);
    dispatch(
      window.catalog?.standalone
        ? fetchPlatformInventoriesS(id, value, meta)
        : fetchPlatformInventories(id, value, meta)
    ).then(() => filteringCallback(false));
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

const PlatformInventories = () => {
  const formatMessage = useFormatMessage();
  const { current: columns } = useRef([
    formatMessage(labelMessages.name),
    formatMessage(labelMessages.description),
    formatMessage(labelMessages.created),
    formatMessage(platformsMessages.workflowColumn)
  ]);
  const [{ filterValue, isFetching, isFiltering }, stateDispatch] = useReducer(
    platformInventoriesState,
    initialState
  );
  const { data, results, count, meta } = useSelector(
    ({ platformReducer: { platformInventories } }) => platformInventories
  );
  const platform = useSelector(
    ({ platformReducer: { selectedPlatform } }) => selectedPlatform
  );
  const dispatch = useDispatch();
  const [{ platform: id }] = useQuery(['platform']);
  const history = useHistory();

  useEffect(() => {
    dispatch(
      window.catalog?.standalone
        ? fetchPlatformInventoriesS(id, filterValue, defaultSettings)
        : fetchPlatformInventories(id, filterValue, defaultSettings)
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
            pathname: '/platforms/platform/platform-inventories/edit-workflow',
            search: `?platform=${id}&inventory=${inventoryData.id}`
          })
      }
    ];
  };

  const dataSet = data ? data : results;
  const metaInfo = meta ? meta : { count };
  const inventoryRows = dataSet ? createRows(dataSet, filterValue) : [];
  console.log(
    'Debug - metaInfo, dataSet, results, platform',
    metaInfo,
    dataSet,
    results,
    platform
  );
  const title = platform ? platform.name : '';
  return (
    <Fragment>
      <ToolbarRenderer
        schema={createPlatformsFilterToolbarSchema({
          onFilterChange: handleFilterChange,
          searchValue: filterValue,
          filterPlaceholder: formatMessage(platformsMessages.inventoriesFilter),
          meta: metaInfo,
          apiRequest: (_, options) =>
            dispatch(
              window.catalog?.standalone
                ? fetchPlatformInventoriesS(id, filterValue, options)
                : fetchPlatformInventories(id, filterValue, options)
            )
        })}
      />
      <Section type="content">
        <ContentList
          ouiaId={'PlatformsTable'}
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
                  ? formatMessage(platformsMessages.noInventoriesDescription)
                  : formatMessage(
                      platformsMessages.noInventoriesFilterDescription
                    )
              }
            />
          )}
        />
      </Section>

      {metaInfo.count > 0 && (
        <BottomPaginationContainer>
          <AsyncPagination
            dropDirection="up"
            meta={metaInfo}
            apiRequest={(_, options) =>
              dispatch(
                window.catalog?.standalone
                  ? fetchPlatformInventoriesS(id, filterValue, options)
                  : fetchPlatformInventories(id, filterValue, options)
              )
            }
          />
        </BottomPaginationContainer>
      )}
    </Fragment>
  );
};

export default PlatformInventories;
