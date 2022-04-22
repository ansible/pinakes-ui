import React from 'react';
import { act } from 'react-dom/test-utils';
import App from '../standalone-nav';
import { Provider } from 'react-redux';
import {
  APPROVAL_ADMIN_ROLE,
  AUTH_API_BASE,
  CATALOG_ADMIN_ROLE
} from '../utilities/constants';
import { MemoryRouter } from 'react-router-dom';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import { mockApi } from '../helpers/shared/__mocks__/user-login';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import * as UserLogin from '../helpers/shared/user-login';

jest.mock('../presentational-components/navigation/routes', () => ({
  __esModule: true,
  Routes: () => <div id="routes-mock">Here would be routes</div>
}));

describe('<App />', () => {
  let wrapper;
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;
  const intialState = {};

  const ComponentWrapper = ({ store, children }) => (
    <Provider store={store}>
      <MemoryRouter>{children}</MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    global.localStorage.setItem('catalog_standalone', true);
    global.localStorage.setItem('user', 'testUser');
    mockStore = configureStore(middlewares);
  });

  afterEach(() => {
    global.localStorage.setItem('catalog_standalone', false);
    global.localStorage.removeItem('user');
  });

  it('renders correctly as catalog administrator role', async () => {
    mockApi.onGet(`${AUTH_API_BASE}/me/`).replyOnce(200, {
      username: 'fred.sample',
      first_name: 'Fred',
      last_name: 'Sample',
      roles: [CATALOG_ADMIN_ROLE]
    });

    let wrapper;
    await act(async () => {
      const store = mockStore(intialState);
      wrapper = mount(
        <ComponentWrapper store={store}>
          <App />
        </ComponentWrapper>
      );
    });
    await act(async () => {
      wrapper.update();
    });

    expect(wrapper.find(NotificationsPortal)).toHaveLength(1);
    expect(wrapper.find('NavItem')).toHaveLength(5);
  });

  it('renders correctly as approval administrator role', async () => {
    mockApi.onGet(`${AUTH_API_BASE}/me/`).replyOnce(200, {
      username: 'fred.sample',
      first_name: 'Fred',
      last_name: 'Sample',
      roles: [APPROVAL_ADMIN_ROLE]
    });
    let wrapper;
    await act(async () => {
      const store = mockStore(intialState);
      wrapper = mount(
        <ComponentWrapper store={store}>
          <App />
        </ComponentWrapper>
      );
    });
    await act(async () => {
      wrapper.update();
    });

    expect(wrapper.find(NotificationsPortal)).toHaveLength(1);
    expect(wrapper.find('NavItem')).toHaveLength(5);
  });

  it('renders correctly as catalog and approval administrator role', async () => {
    mockApi.onGet(`${AUTH_API_BASE}/me/`).replyOnce(200, {
      username: 'fred.sample',
      first_name: 'Fred',
      last_name: 'Sample',
      roles: [`${CATALOG_ADMIN_ROLE}`, `${APPROVAL_ADMIN_ROLE}`]
    });

    let wrapper;
    await act(async () => {
      const store = mockStore(intialState);
      wrapper = mount(
        <ComponentWrapper store={store}>
          <App />
        </ComponentWrapper>
      );
    });
    await act(async () => {
      wrapper.update();
    });

    expect(wrapper.find(NotificationsPortal)).toHaveLength(1);
    expect(wrapper.find('NavItem')).toHaveLength(6);
  });

  it('call loginUser with the next parameter', async () => {
    mockApi.onGet(`${AUTH_API_BASE}/me/`).replyOnce(200, {
      username: 'fred.sample',
      first_name: 'Fred',
      last_name: 'Sample',
      roles: [CATALOG_ADMIN_ROLE]
    });

    const spy = spyOn(UserLogin, 'loginUser');
    let wrapper;
    await act(async () => {
      const store = mockStore(intialState);
      wrapper = mount(
        <ComponentWrapper store={store}>
          <App />
        </ComponentWrapper>
      );
    });
    await act(async () => {
      wrapper.update();
    });

    expect(spy).toHaveBeenCalledWith('test');
  });
});
