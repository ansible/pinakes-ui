import React, { Fragment, useEffect, useReducer, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { SearchIcon } from '@patternfly/react-icons';
import { Section } from '@redhat-cloud-services/frontend-components/components/cjs/Section';
import { scrollToTop } from '../../helpers/shared/helpers';
import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import { defaultSettings } from '../../helpers/shared/pagination';
import { fetchPlatformInventories } from '../../redux/actions/platform-actions';
import { createPlatformsFilterToolbarSchema } from '../../toolbar/schemas/platforms-toolbar.schema';
import ContentGaleryEmptyState from '../../presentational-components/shared/content-gallery-empty-state';
import asyncFormValidator from '../../utilities/async-form-validator';
import ContentList from '../../presentational-components/shared/content-list';
import { createRows } from './platform-table-helpers.js';
import AsyncPagination from '../common/async-pagination';
import BottomPaginationContainer from '../../presentational-components/shared/bottom-pagination-container';
import useQuery from '../../utilities/use-query';
import { FormattedMessage, defineMessage, useIntl } from 'react-intl';
import statesMessages from '../../messages/states.messages';
import labelMessages from '../../messages/labels.messages';

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

const PlatformInventories = () => {
  const { formatMessage } = useIntl();
  /**
   * Has to be wrapped in fragment because the amazing piece of code called react tabular used byt PF is copying
   * the props and shoving them onto the table header cell DOM element and we need to wrap the text intro extra element to prevent
   * errors. ¯\_(ツ)_/¯
   */
  const {
    current: { columns, filterPlaceholder }
  } = useRef({
    filterPlaceholder: formatMessage(
      defineMessage({
        id: 'platform.inventories.filter.placeholder',
        defaultMessage: 'Filter by inventory'
      })
    ),
    columns: [
      formatMessage(labelMessages.name),
      formatMessage(labelMessages.description),
      formatMessage(statesMessages.created),
      <Fragment key="workflow">
        <FormattedMessage
          id="platform.inventories.columns.workflow"
          defaultMessage="Workflow"
        />
      </Fragment>
    ]
  });
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

  const inventoryRows = data ? createRows(data, filterValue) : [];
  const title = platform ? platform.name : '';
  return (
    <Fragment>
      <ToolbarRenderer
        schema={createPlatformsFilterToolbarSchema({
          onFilterChange: handleFilterChange,
          searchValue: filterValue,
          filterPlaceholder,
          meta,
          apiRequest: (_, options) =>
            dispatch(fetchPlatformInventories(id, filterValue, options))
        })}
      />
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
                filterValue === '' ? (
                  <FormattedMessage
                    id="platform.inventories.empty.no-inventories"
                    defaultMessage="No inventories found."
                  />
                ) : (
                  <FormattedMessage
                    id="platform.inventories.empty.no-esults"
                    defaultMessage="No inventories match your filter criteria."
                  />
                )
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
