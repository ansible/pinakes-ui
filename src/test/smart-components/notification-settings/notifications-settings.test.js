import React from 'react';
import { act } from 'react-dom/test-utils';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import { IntlProvider } from 'react-intl';
import NotificationSettings, {
  notificationSettingsListState
} from '../../../smart-components/notification-settings/notification-settings';
import notificationSettingsReducer, {
  notificationSettingsInitialState
} from '../../../redux/reducers/notification-setting-reducer';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import { groupsInitialState } from '../../../redux/reducers/group-reducer';
import { APPROVAL_API_BASE } from '../../../utilities/approval-constants';
import RemoveWorkflowModal from '../../../smart-components/notification-settings/remove-notification-setting-modal';
import ReducerRegistry, {
  applyReducerHash
} from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import routes from '../../../constants/approval-routes';
import TableEmptyState from '../../../presentational-components/shared/approval-table-empty-state';
import * as edit from '../../../smart-components/notification-settings/edit-notification-setting-modal';
import { mockApi } from '../../../helpers/shared/__mocks__/user-login';
import AddNotificationSetting from '../../../smart-components/notification-settings/add-notification-settings-modal';
import RemoveNotificationSettingModal from '../../../smart-components/notification-settings/remove-notification-setting-modal';

const ComponentWrapper = ({
  store,
  initialEntries = [routes.notifications.index],
  children
}) => (
  <Provider store={store}>
    <MemoryRouter initialEntries={initialEntries}>
      <IntlProvider locale="en">{children}</IntlProvider>
    </MemoryRouter>
  </Provider>
);

describe('<NotificationSettings />', () => {
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;
  let stateWithData;
  let stateWithNotificationSettings;

  beforeEach(() => {
    localStorage.setItem('catalog_standalone', true);
    localStorage.setItem('user', 'testUser');
    mockStore = configureStore(middlewares);
    stateWithData = {
      groupReducer: { ...groupsInitialState },
      notificationSettingsReducer: {
        ...notificationSettingsInitialState,
        notificationSettings: {
          data: [
            {
              id: 'edit-id',
              name: 'foo'
            }
          ],
          meta: {
            count: 1,
            limit: 10,
            offset: 0
          }
        },
        notificationSetting: {},
        filterValue: '',
        isLoading: false,
        isRecordLoading: false
      }
    };
    const ns1 = {
      id: '123',
      name: 'ns1',
      selected: true,
      settings: []
    };
    const ns2 = {
      id: '456',
      name: 'ns2',
      selected: true,
      settings: []
    };
    const ns3 = {
      id: '789',
      name: 'ns',
      selected: true,
      settings: []
    };

    stateWithNotificationSettings = {
      groupReducer: { ...groupsInitialState },
      notificationSettingsReducer: {
        ...notificationSettingsInitialState,
        notificationSettings: {
          data: [ns1, ns2, ns3],
          meta: {
            count: 21,
            limit: 10,
            offset: 0
          }
        },
        notificationSetting: {},
        filterValue: '',
        isLoading: false,
        isRecordLoading: false
      }
    };
  });

  afterEach(() => {
    global.localStorage.setItem('catalog_standalone', false);
    global.localStorage.removeItem('user');
  });

  it('should redirect to Edit info page', async () => {
    edit.default = jest.fn().mockImplementation(() => <span />);

    const store = mockStore(stateWithData);
    let wrapper;
    mockApi
      .onGet(`${APPROVAL_API_BASE}/notification_settings/?page_size=50&page=1`)
      .replyOnce(200, {
        count: 3,
        data: [
          {
            id: 'edit-id',
            name: 'foo',
            settings: [{ name: '1' }]
          }
        ]
      });

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store}>
          <Route
            path={routes.notifications.index}
            component={NotificationSettings}
          />
        </ComponentWrapper>
      );
    });
    wrapper.update();
    /**
     * Open action drop down and click on edit info action
     */
    wrapper
      .find('button.pf-c-dropdown__toggle.pf-m-plain')
      .last()
      .simulate('click');
    await act(async () => {
      wrapper
        .find('button.pf-c-dropdown__menu-item')
        .first()
        .simulate('click');
    });

    wrapper.update();

    await act(async () => {
      wrapper.update();
    });

    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual(routes.notifications.edit);
    expect(
      wrapper.find(MemoryRouter).instance().history.location.search
    ).toEqual('?notificationSetting=edit-id');
    expect(wrapper.find(edit.default)).toHaveLength(1);
  });

  it('should redirect to Delete approval process page', async () => {
    const store = mockStore(stateWithData);
    let wrapper;

    mockApi
      .onGet(`${APPROVAL_API_BASE}/notification_settings/?page_size=50&page=1`)
      .replyOnce({
        body: {
          data: [
            {
              id: 'edit-id',
              name: 'foo',
              group_refs: [{ name: 'group-1', uuid: 'some-uuid' }]
            }
          ]
        }
      });

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store}>
          <Route
            path={routes.notifications.index}
            component={NotificationSettings}
          />
        </ComponentWrapper>
      );
    });
    wrapper.update();
    /**
     * Open action drop down and click on delete action
     */
    wrapper
      .find('button.pf-c-dropdown__toggle.pf-m-plain')
      .last()
      .simulate('click');
    await act(async () => {
      wrapper
        .find('button.pf-c-dropdown__menu-item')
        .last()
        .simulate('click');
    });

    wrapper.update();
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual(routes.notifications.remove);
    expect(
      wrapper.find(MemoryRouter).instance().history.location.search
    ).toEqual('?notificationSetting=edit-id');
    expect(wrapper.find(RemoveWorkflowModal)).toHaveLength(1);
  });

  it('should redirect to add notification settings page', async () => {
    const store = mockStore(stateWithData);
    let wrapper;

    mockApi
      .onGet(`${APPROVAL_API_BASE}/notification_settings/?limit=50&offset=0`)
      .replyOnce({
        body: {
          data: [
            {
              id: 'edit-id',
              name: 'foo',
              settings: ['group-name-1']
            }
          ]
        }
      });

    // async name validator
    mockApi
      .onGet(`${APPROVAL_API_BASE}/notification_settings/?page_size=50&pae=1`)
      .replyOnce({
        body: {
          data: [
            {
              id: 'edit-id',
              name: 'foo',
              settings: [{ name: '1' }]
            }
          ]
        }
      });

    mockApi
      .onGet(`${APPROVAL_API_BASE}/notification_types/`)
      .replyOnce(200, { data: [{ id: 'id', name: 'name' }] });

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store}>
          <Route
            path={routes.notifications.index}
            component={NotificationSettings}
          />
        </ComponentWrapper>
      );
    });
    wrapper.update();
    /**
     * Click on add notification setting link
     */
    await act(async () => {
      wrapper
        .find('Button')
        .at(0)
        .simulate('click', { button: 0 });
    });
    wrapper.update();

    await act(async () => {
      wrapper.update();
    });

    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual(routes.notifications.add);
    expect(wrapper.find(AddNotificationSetting)).toHaveLength(1);
  });

  it('should remove multiple selected notification settings from table', async () => {
    const store = mockStore(stateWithData);
    let wrapper;

    mockApi
      .onGet(`${APPROVAL_API_BASE}/notification_settings/?page-size=50&page=1`)
      .replyOnce(200, {
        data: [
          {
            id: 'edit-id',
            name: 'foo',
            group_refs: [{ name: 'group-1', uuid: 'some-uuid' }],
            group_names: ['group-name-1']
          }
        ]
      });

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store}>
          <Route
            path={routes.notifications.index}
            component={NotificationSettings}
          />
        </ComponentWrapper>
      );
    });
    wrapper.update();
    wrapper
      .find('input[type="checkbox"]')
      .last()
      .simulate('change', { target: { checked: true } });
    wrapper
      .find('Button')
      .at(1)
      .simulate('click', { button: 0 });
    wrapper.update();
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual(routes.notifications.remove);
    expect(
      wrapper.find(MemoryRouter).instance().history.location.search
    ).toEqual('');
    expect(wrapper.find(RemoveNotificationSettingModal)).toHaveLength(1);
  });

  it('should render table empty state', async () => {
    mockApi
      .onGet(`${APPROVAL_API_BASE}/notification_types/`)
      .replyOnce(200, { data: [{ id: 'id', name: 'name' }] });
    mockApi
      .onGet(`${APPROVAL_API_BASE}/notification_settings/?page_size=50&page=1`)
      .replyOnce({
        status: 200,
        body: {
          count: 0,
          data: []
        }
      });

    const registry = new ReducerRegistry({}, [thunk, promiseMiddleware]);
    registry.register({
      notificationSettingsReducer: applyReducerHash(
        notificationSettingsReducer,
        notificationSettingsInitialState
      )
    });
    const storeReal = registry.getStore();

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={storeReal}>
          <Route
            path={routes.notifications.index}
            component={NotificationSettings}
          />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    expect(wrapper.find(TableEmptyState)).toHaveLength(1);
  });

  it('should select only one notification setting and delete it', async () => {
    expect.assertions(3);
    const store = mockStore(stateWithNotificationSettings);
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store}>
          <Route
            path={routes.notifications.index}
            component={NotificationSettings}
          />
        </ComponentWrapper>
      );
    });
    wrapper.update();
    mockApi
      .onGet(`${APPROVAL_API_BASE}/notification_types/`)
      .replyOnce(200, { data: [{ id: 'id', name: 'name' }] });
    await act(async () => {
      wrapper
        .find('input[type="checkbox"]')
        .at(1)
        .simulate('change', { target: { checked: true } });
    });
    wrapper.update();
    await act(async () => {
      wrapper
        .find('Button')
        .at(1)
        .simulate('click', { button: 0 });
    });
    wrapper.update();

    expect(wrapper.find('Modal').instance(0).props['aria-label']).toEqual(
      'Delete notification modal'
    );
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual(routes.notifications.remove);
    expect(
      wrapper.find(MemoryRouter).instance().history.location.search
    ).toEqual('');

    // Delete endpoints
    mockApi
      .onDelete(`${APPROVAL_API_BASE}/notification_settings/123/`)
      .replyOnce((_req, res) => {
        expect(true).toEqual(true); // just check that it was called
        return res.status(200);
      });
    wrapper.update();
    // wf refresh
    mockApi
      .onGet(`${APPROVAL_API_BASE}/notification_settings/?page_size=50&page=1`)
      .replyOnce((req, res) => {
        expect(req.url().query).toEqual({
          page_size: '50',
          page: '1'
        });
        return res.status(200).body({
          count: 2,
          data: []
        });
      });
    wrapper.update();
    await act(async () => {
      wrapper
        .find('button')
        .at(6)
        .simulate('click');
    });
  });

  it('reset selected', () => {
    const state = {
      selectedNotificationSettings: ['id1', 'id3'],
      selectedAll: true
    };
    const expectedResults = {
      ...state,
      selectedAll: false,
      selectedNotificationSettings: []
    };

    expect(
      notificationSettingsListState(state, { type: 'resetSelected' })
    ).toEqual(expectedResults);
  });

  it('select all on current page', () => {
    const state = {
      selectedNotificationSettings: ['id1', 'id3'],
      selectedAll: false
    };
    const expectedResults = {
      ...state,
      selectedAll: true,
      selectedNotificationSettings: ['id1', 'id3', 'id2']
    };

    expect(
      notificationSettingsListState(state, {
        type: 'selectAll',
        payload: ['id1', 'id2']
      })
    ).toEqual(expectedResults);
  });

  it('unselect all on current page', () => {
    const state = {
      selectedNotificationSettings: ['id1', 'id3', 'id2'],
      selectedAll: true
    };
    const expectedResults = {
      ...state,
      selectedAll: false,
      selectedNotificationSettings: ['id3']
    };

    expect(
      notificationSettingsListState(state, {
        type: 'unselectAll',
        payload: ['id1', 'id2']
      })
    ).toEqual(expectedResults);
  });

  it('all are selected on new page', () => {
    const rows = [{ id: 'id1' }, { id: 'id3' }];

    const state = {
      selectedNotificationSettings: ['id1', 'id3', 'id2'],
      selectedAll: false
    };
    const expectedResults = { ...state, selectedAll: true, rows };

    expect(
      notificationSettingsListState(state, { type: 'setRows', payload: rows })
    ).toEqual(expectedResults);
  });

  it('not all are selected on new page', () => {
    const rows = [{ id: 'id1' }, { id: 'id4' }];

    const state = {
      selectedNotificationSettings: ['id1', 'id3', 'id2'],
      selectedAll: false
    };
    const expectedResults = { ...state, selectedAll: false, rows };

    expect(
      notificationSettingsListState(state, { type: 'setRows', payload: rows })
    ).toEqual(expectedResults);
  });

  it('default', () => {
    const state = {
      selectedNotificationSettings: ['id1', 'id3', 'id2'],
      selectedAll: false
    };
    const expectedResults = { ...state };

    expect(notificationSettingsListState(state, { type: 'default' })).toEqual(
      expectedResults
    );
  });
});
