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
import EditTemplate from '../../../../smart-components/template/edit-template-modal';
import { APPROVAL_API_BASE } from '../../../../utilities/approval-constants';

describe('<EditTemplate />', () => {
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
      templateId: '123',
      objectType: 'Portfolio',
      objectName: () => 'Test Resource Name',
      pushParam: { pathname: '/foo', search: '?platform=1' }
    };
    initialState = {
      i18nReducer: {
        ...useIntl()
      },
      templateReducer: {
        templates: {
          results: [
            {
              id: '111',
              name: 'Workflow111'
            },
            {
              id: '222',
              name: 'template'
            }
          ]
        }
      }
    };
    mockStore = configureStore(middlewares);
  });

  afterEach(() => {
    mockApi.reset();
    localStorage.setItem('catalog_standalone', false);
    localStorage.removeItem('user');
  });

  it('should render correctly', async () => {
    const store = mockStore(initialState);
    mockApi
      .onGet(`${APPROVAL_API_BASE}/templates/`)
      .replyOnce(200, { results: [] });
    let wrapper;
    await act(async () => {
      wrapper = shallow(
        <ComponentWrapper store={store}>
          <EditTemplate querySelector="template" {...initialProps} />
        </ComponentWrapper>
      ).dive();
    });
    wrapper.update();
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should create the edit template modal', async (done) => {
    const store = mockStore(initialState);
    mockApi.onGet(`${APPROVAL_API_BASE}/templates/123/`).replyOnce(200, {
      title: 'template',
      id: '123',
      description: 'description'
    });

    mockApi
      .onGet(`${APPROVAL_API_BASE}/notifications_settings/`)
      .replyOnce(200, {
        data: [
          {
            name: 'notification',
            id: '123',
            description: 'description'
          }
        ]
      });

    const expectedSchema = {
      fields: [
        {
          component: componentTypes.TEXT_FIELD,
          name: 'title',
          isRequired: true,
          id: 'template-title',
          label: 'Title',
          validate: [
            expect.any(Function),
            {
              message: 'Enter a name for the template',
              type: 'required'
            }
          ]
        },
        {
          component: componentTypes.TEXTAREA,
          name: 'description',
          id: 'template-description',
          label: 'Description'
        },
        {
          component: 'select',
          label: 'Process method',
          loadOptions: expect.any(Function),
          name: 'process_method',
          isClearable: true,
          isSearchable: true,
          placeholder: 'Select...'
        },
        {
          component: 'select',
          label: 'Signal method',
          loadOptions: expect.any(Function),
          isClearable: true,
          isSearchable: true,
          name: 'signal_method',
          placeholder: 'Select...'
        }
      ]
    };

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper
          store={store}
          initialEntries={['/template?template=123']}
        >
          <Route
            path="/template"
            render={(args) => (
              <EditTemplate
                querySelector="template"
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

  it('should submit updated template', async (done) => {
    const store = mockStore(initialState);

    mockApi
      .onGet(`${APPROVAL_API_BASE}/notifications_settings/`)
      .replyOnce(200, { data: [{ id: 'id', title: 'name' }] });

    mockApi.onGet(`${APPROVAL_API_BASE}/templates/123/`).replyOnce(200, {
      title: 'template',
      id: '123',
      description: 'description'
    });
    mockApi.onGet(`${APPROVAL_API_BASE}/templates/?title=template`).reply(200, [
      {
        name: 'template1',
        id: '111'
      },
      {
        name: 'template2',
        id: '222'
      }
    ]);
    mockApi
      .onGet(`${APPROVAL_API_BASE}/templates/?&page_size=50&page=1`)
      .reply(200, { results: [{ name: 'template1', id: '111' }] });

    mockApi.onPatch(`${APPROVAL_API_BASE}/templates/123/`).replyOnce((req) => {
      expect(JSON.parse(req.data)).toEqual({
        title: 'template',
        description: 'some-description',
        id: '123'
      });
      return [200, {}];
    });
    mockApi
      .onGet(`${APPROVAL_API_BASE}/notifications_settings/`)
      .replyOnce(200, {
        data: [
          {
            name: 'notification',
            id: '123',
            description: 'description'
          }
        ]
      });

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
          initialEntries={['/template?template=123']}
        >
          <Route
            path="/template"
            render={(args) => (
              <EditTemplate
                {...args}
                {...initialProps}
                querySelector="template"
                postMethod={onCloseMock}
              />
            )}
          />
        </ComponentWrapper>
      );
    });
    await act(async () => {
      /**run first debounced data loading for existing templates */
      jest.runAllTimers();
      wrapper.update();
    });
    await act(async () => {
      const description = wrapper.find('textarea').first();
      description.instance().value = 'some-description';
      description.simulate('change');
    });
    wrapper.update();
    await act(async () => {
      /**run rest of paginated async request */
      jest.runAllTimers();
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
      ).toEqual('/approval/templates');
      done();
    });
  });
});
