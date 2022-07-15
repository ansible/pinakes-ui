import React from 'react';
import { act } from 'react-dom/test-utils';
import thunk from 'redux-thunk';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Modal } from '@patternfly/react-core';
import { shallowToJson } from 'enzyme-to-json';
import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { componentTypes } from '@data-driven-forms/react-form-renderer';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import { useIntl } from 'react-intl';
import FormRenderer from '../../../../smart-components/common/form-renderer';
import { mockApi } from '../../../../helpers/shared/__mocks__/user-login';
import { APPROVAL_API_BASE } from '../../../../utilities/approval-constants';
import EditNotificationSetting from '../../../../smart-components/notification-settings/edit-notification-setting-modal';

describe('<EditNotificationSetting />', () => {
  let initialProps;
  let initialState;
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;

  const ComponentWrapper = ({ store, children, initialEntries }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    localStorage.setItem('catalog_standalone', true);
    localStorage.setItem('user', 'test');
    initialProps = {
      closeUrl: 'foo',
      notificationSettingId: '123'
    };
    initialState = {
      i18nReducer: {
        ...useIntl()
      },
      notificationSettingsReducer: {
        notificationSettings: {
          results: [
            {
              id: '111',
              name: 'Notification111'
            },
            {
              id: '123',
              name: 'Foo'
            }
          ]
        }
      }
    };
    mockStore = configureStore(middlewares);
  });

  afterEach(() => {
    localStorage.setItem('catalog_standalone', false);
    localStorage.removeItem('user');
  });

  it('should render correctly', async () => {
    const store = mockStore(initialState);
    mockApi
      .onGet(`${APPROVAL_API_BASE}/notifications_settings/`)
      .replyOnce(200, { results: [] });
    let wrapper;
    await act(async () => {
      wrapper = shallow(
        <ComponentWrapper store={store}>
          <EditNotificationSetting
            querySelector="notificationSetting"
            {...initialProps}
          />
        </ComponentWrapper>
      ).dive();
    });
    wrapper.update();
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should create the edit notification setting modal', async (done) => {
    const store = mockStore(initialState);
    mockApi
      .onGet(`${APPROVAL_API_BASE}/notifications_settings/123/`)
      .replyOnce(200, {
        name: 'Foo',
        id: '123',
        notification_type: null,
        settings: {}
      });

    mockApi
      .onGet(`${APPROVAL_API_BASE}/notification_types/`)
      .replyOnce(200, {});

    const expectedSchema = {
      fields: [
        {
          component: componentTypes.TEXT_FIELD,
          name: 'name',
          isRequired: true,
          id: 'notification-name',
          label: 'Name',
          validate: [
            expect.any(Function),
            {
              message: 'Enter a name for the notification setting',
              type: 'required'
            }
          ]
        },
        {
          component: 'select',
          label: 'Notification type',
          loadOptions: expect.any(Function),
          name: 'notification_type'
        },
        {
          component: 'sub-form',
          fields: [],
          id: 'notification-settings',
          label: 'Settings',
          name: 'settings',
          title: 'Settings'
        }
      ]
    };

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          store={store}
          initialEntries={['/notifications/?notificationSetting=123']}
        >
          <Route
            path="/notifications"
            render={(args) => (
              <EditNotificationSetting
                querySelector="notificationSetting"
                {...args}
                {...initialProps}
              />
            )}
          />
        </ComponentWrapper>
      );
    });

    wrapper.update();
    const modal = wrapper.find(Modal);
    const form = wrapper.find(FormRenderer);
    expect(modal.props().title).toEqual('Edit information');
    expect(form.props().schema).toEqual(expectedSchema);
    done();
  });

  it('should submit updated notification setting', async (done) => {
    const store = mockStore(initialState);
    mockApi
      .onGet(`${APPROVAL_API_BASE}/notifications_settings/123/`)
      .replyOnce(200, {
        name: 'Foo',
        id: '123',
        notification_type: null,
        settings: {}
      });

    mockApi
      .onPatch(`${APPROVAL_API_BASE}/notifications_settings/123/`)
      .replyOnce((req) => {
        expect(JSON.parse(req.data)).toEqual({
          name: 'Foo',
          id: '123',
          notification_type: null,
          settings: {}
        });
      });

    mockApi
      .onGet(`${APPROVAL_API_BASE}/notification_types/`)
      .replyOnce(200, {});
    mockApi
      .onGet(`${APPROVAL_API_BASE}/notifications_settings/?name=Foo`)
      .reply(200, [
        {
          name: 'Foo',
          id: '123',
          notification_type: null,
          settings: {}
        }
      ]);

    let onCloseMock = jest.fn().mockImplementation(() =>
      Promise.resolve({
        data: []
      })
    );
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          store={store}
          initialEntries={['/notification-setting/?notificationSetting=123']}
        >
          <Route
            path="/notification-setting"
            render={(args) => (
              <EditNotificationSetting
                {...args}
                {...initialProps}
                querySelector="notificationSetting"
                postMethod={onCloseMock}
              />
            )}
          />
        </ComponentWrapper>
      );
    });
    await act(async () => {
      wrapper.update();
    });
    await act(async () => {
      const name = wrapper.find('input').first();
      name.instance().value = 'some-name';
      name.simulate('change');
    });
    wrapper.update();
    await act(async () => {
      wrapper.update();
    });
    await act(async () => {
      wrapper
        .find('button')
        .first()
        .simulate('click');
    });

    expect(onCloseMock).not.toHaveBeenCalled();

    await act(async () => {
      wrapper.find('form').simulate('submit');
    });

    wrapper.update();

    setImmediate(() => {
      expect(
        wrapper.find(MemoryRouter).instance().history.location.pathname
      ).toEqual('/approval/notifications');
      done();
    });
  });
});
