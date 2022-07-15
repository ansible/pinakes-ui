import React, {
  Fragment,
  useEffect,
  useReducer,
  useRef,
  useState
} from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Route, Link, useHistory } from 'react-router-dom';
import {
  ToolbarGroup,
  ToolbarItem,
  Button,
  Checkbox
} from '@patternfly/react-core';
import { PlusCircleIcon, SearchIcon } from '@patternfly/react-icons';
import { truncate, cellWidth } from '@patternfly/react-table';
import {
  clearFilterValueNotificationSettings,
  fetchNotificationSettings,
  setFilterValueNotificationSettings
} from '../../redux/actions/notification-actions';
import AddNotificationSetting from './add-notification-settings-modal';
import RemoveNotificationSettingModal from './remove-notification-setting-modal';
import { createRows } from './notification-settings-table-helpers';
import { TableToolbarView } from '../../presentational-components/shared/approval-table-toolbar-view';
import {
  TopToolbar,
  TopToolbarTitle
} from '../../presentational-components/shared/approval-top-toolbar';
import { AppTabs } from '../app-tabs/app-tabs';
import { defaultSettings } from '../../helpers/shared/approval-pagination';
import asyncDebounce from '../../utilities/async-form-validator';
import TableEmptyState from '../../presentational-components/shared/approval-table-empty-state';
import routesLinks from '../../constants/approval-routes';
import { useIntl } from 'react-intl';
import commonMessages from '../../messages/common.message';
import notificationMessages from '../../messages/notification.messages';
import formMessages from '../../messages/form.messages';
import tableToolbarMessages from '../../messages/table-toolbar.messages';
import EditNotificationSetting from './edit-notification-setting-modal';
import isEmpty from 'lodash/isEmpty';
import NotificationSettingTableContext from './notification-setting-table-context';

const columns = (intl, selectedAll, selectAll) => [
  {
    title: (
      <Checkbox onChange={selectAll} isChecked={selectedAll} id="select-all" />
    ),
    transforms: [cellWidth(1)]
  },
  {
    title: intl.formatMessage(tableToolbarMessages.name)
  },
  {
    title: intl.formatMessage(notificationMessages.type)
  }
];

const debouncedFilter = asyncDebounce(
  (filter, dispatch, filteringCallback, meta = defaultSettings) => {
    filteringCallback(true);
    dispatch(setFilterValueNotificationSettings(filter, meta));
    return dispatch(fetchNotificationSettings(meta)).then(() =>
      filteringCallback(false)
    );
  },
  1000
);

const prepareChips = (filterValue, intl) =>
  filterValue
    ? [
        {
          category: intl.formatMessage(tableToolbarMessages.name),
          key: 'name',
          chips: [{ name: filterValue, value: filterValue }]
        }
      ]
    : [];

const initialState = (filterValue = '') => ({
  filterValue,
  isFetching: true,
  isFiltering: false,
  selectedNotificationSettings: [],
  selectedAll: false,
  rows: []
});

const areSelectedAll = (rows = [], selected) =>
  rows.every((row) => selected.includes(row.id));

const unique = (value, index, self) => self.indexOf(value) === index;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const notificationSettingsListState = (state, action) => {
  switch (action.type) {
    case 'setRows':
      return {
        ...state,
        rows: action.payload,
        selectedAll: areSelectedAll(
          action.payload,
          state.selectedNotificationSettings
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
        selectedAll: false,
        selectedNotificationSettings: state.selectedNotificationSettings.includes(
          action.payload
        )
          ? state.selectedNotificationSettings.filter(
              (id) => id !== action.payload
            )
          : [...state.selectedNotificationSettings, action.payload]
      };
    case 'selectAll':
      return {
        ...state,
        selectedNotificationSettings: [
          ...state.selectedNotificationSettings,
          ...action.payload
        ].filter(unique),
        selectedAll: true
      };
    case 'unselectAll':
      return {
        ...state,
        selectedNotificationSettings: state.selectedNotificationSettings.filter(
          (selected) => !action.payload.includes(selected)
        ),
        selectedAll: false
      };
    case 'resetSelected':
      return {
        ...state,
        selectedNotificationSettings: [],
        selectedAll: false
      };
    case 'setFilteringFlag':
      return {
        ...state,
        isFiltering: action.payload
      };
    case 'clearFilters':
      return { ...state, filterValue: '', isFetching: true };
    default:
      return state;
  }
};

const NotificationSettings = () => {
  const { notificationSettings, filterValueRedux } = useSelector(
    ({
      notificationSettingsReducer: {
        notificationSettings,
        filterValue: filterValueRedux
      }
    }) => ({
      notificationSettings,
      filterValueRedux
    }),
    shallowEqual
  );
  const [limit, setLimit] = useState(defaultSettings.limit);
  const [offset, setOffset] = useState(1);

  const data = notificationSettings?.data;
  const meta = notificationSettings?.meta || {
    count: notificationSettings.count,
    limit,
    offset
  };
  const [
    {
      filterValue,
      isFetching,
      isFiltering,
      selectedNotificationSettings,
      selectedAll,
      rows
    },
    stateDispatch
  ] = useReducer(notificationSettingsListState, initialState(filterValueRedux));

  const dispatch = useDispatch();
  const history = useHistory();
  const intl = useIntl();

  const setSelectedNotificationSettings = (id) =>
    stateDispatch({ type: 'select', payload: id });

  const updateNotificationSettings = (pagination) => {
    stateDispatch({ type: 'setFetching', payload: true });
    return dispatch(fetchNotificationSettings(pagination))
      .then(() =>
        stateDispatch({
          type: 'setRows',
          payload: createRows(notificationSettings?.data)
        })
      )
      .then(() => stateDispatch({ type: 'setFetching', payload: false }))
      .catch(() => stateDispatch({ type: 'setFetching', payload: false }));
  };

  useEffect(() => {
    updateNotificationSettings(defaultSettings);
  }, []);

  useEffect(() => {
    stateDispatch({
      type: 'setRows',
      payload: createRows(notificationSettings?.data)
    });
  }, [notificationSettings?.data]);

  const clearFilters = () => {
    stateDispatch({ type: 'clearFilters' });
    dispatch(clearFilterValueNotificationSettings());
    return updateNotificationSettings(meta);
  };

  const handleFilterChange = (value) => {
    !value || value === ''
      ? clearFilters()
      : stateDispatch({ type: 'setFilterValue', payload: value });
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
      <Route
        exact
        path={routesLinks.notifications.add}
        render={(props) => (
          <AddNotificationSetting
            {...props}
            postMethod={updateNotificationSettings}
          />
        )}
      />
      <Route
        exact
        path={routesLinks.notifications.edit}
        render={(props) => (
          <EditNotificationSetting
            {...props}
            postMethod={updateNotificationSettings}
          />
        )}
      />
      <Route
        exact
        path={routesLinks.notifications.remove}
        render={(props) => (
          <RemoveNotificationSettingModal
            {...props}
            ids={selectedNotificationSettings}
            fetchData={updateNotificationSettings}
            pagination={meta}
            resetSelectedNotificationSettings={() =>
              stateDispatch({ type: 'resetSelected' })
            }
          />
        )}
      />
    </Fragment>
  );

  const actionResolver = () => [
    {
      title: intl.formatMessage(notificationMessages.edit),
      component: 'button',
      onClick: (_event, _rowId, notificationSetting) =>
        history.push({
          pathname: routesLinks.notifications.edit,
          search: `?notificationSetting=${notificationSetting.id}`
        })
    },
    {
      title: intl.formatMessage(commonMessages.delete),
      component: 'button',
      onClick: (_event, _rowId, notificationSetting) =>
        history.push({
          pathname: routesLinks.notifications.remove,
          search: `?notificationSetting=${notificationSetting.id}`
        })
    }
  ];

  const selectAllFunction = () =>
    selectedAll
      ? stateDispatch({ type: 'unselectAll', payload: data.map((wf) => wf.id) })
      : stateDispatch({ type: 'selectAll', payload: data.map((wf) => wf.id) });

  const anyNotificationSettingsSelected =
    selectedNotificationSettings.length > 0;

  const toolbarButtons = () => (
    <ToolbarGroup className={`pf-u-pl-lg top-toolbar`}>
      <ToolbarItem>
        <Link
          id="add-notificationSetting-link"
          to={{ pathname: routesLinks.notifications.add }}
        >
          <Button
            ouiaId={'add-notificationSetting-link'}
            variant="primary"
            aria-label={intl.formatMessage(formMessages.create)}
          >
            {intl.formatMessage(formMessages.create)}
          </Button>
        </Link>
      </ToolbarItem>
      <ToolbarItem>
        <Link
          id="remove-multiple-notificationSettings"
          className={anyNotificationSettingsSelected ? '' : 'disabled-link'}
          to={{ pathname: routesLinks.notifications.remove }}
        >
          <Button
            variant="secondary"
            isDisabled={!anyNotificationSettingsSelected}
            aria-label={intl.formatMessage(
              notificationMessages.deleteNotificationTitle
            )}
          >
            {intl.formatMessage(commonMessages.delete)}
          </Button>
        </Link>
      </ToolbarItem>
    </ToolbarGroup>
  );

  return (
    <Fragment>
      <TopToolbar>
        <TopToolbarTitle
          title={intl.formatMessage(commonMessages.approvalTitle)}
        />
        <AppTabs />
      </TopToolbar>
      <NotificationSettingTableContext.Provider
        value={{
          selectedNotificationSettings,
          setSelectedNotificationSettings
        }}
      >
        <TableToolbarView
          ouiaId={'notification-settings-table'}
          rows={rows}
          columns={columns(intl, selectedAll, selectAllFunction)}
          fetchData={updateNotificationSettings}
          routes={routes}
          actionResolver={actionResolver}
          titlePlural={intl.formatMessage(notificationMessages.notifications)}
          titleSingular={intl.formatMessage(notificationMessages.notification)}
          pagination={meta}
          setOffset={setOffset}
          setLimit={setLimit}
          toolbarButtons={toolbarButtons}
          filterValue={filterValue}
          onFilterChange={handleFilterChange}
          isLoading={isFetching || isFiltering}
          renderEmptyState={() => (
            <TableEmptyState
              title={
                filterValue === ''
                  ? intl.formatMessage(notificationMessages.noNotifications)
                  : intl.formatMessage(tableToolbarMessages.noResultsFound)
              }
              icon={isEmpty(filterValue) ? PlusCircleIcon : SearchIcon}
              PrimaryAction={() =>
                filterValue !== '' ? (
                  <Button onClick={() => clearFilters()} variant="link">
                    {intl.formatMessage(tableToolbarMessages.clearAllFilters)}
                  </Button>
                ) : (
                  <Link
                    id="create-notificationSetting-link"
                    to={{ pathname: routesLinks.notifications.add }}
                  >
                    <Button
                      ouiaId={'create-notificationSetting-link'}
                      variant="primary"
                      aria-label={intl.formatMessage(
                        notificationMessages.createNotification
                      )}
                    >
                      {intl.formatMessage(
                        notificationMessages.createNotification
                      )}
                    </Button>
                  </Link>
                )
              }
              description={
                filterValue === ''
                  ? intl.formatMessage(notificationMessages.noNotifications)
                  : intl.formatMessage(
                      tableToolbarMessages.clearAllFiltersDescription
                    )
              }
              isSearch={!isEmpty(filterValue)}
            />
          )}
          activeFiltersConfig={{
            filters: prepareChips(filterValue, intl),
            onDelete: () => handleFilterChange('')
          }}
        />
      </NotificationSettingTableContext.Provider>
    </Fragment>
  );
};

export default NotificationSettings;
