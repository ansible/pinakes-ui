import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { act } from 'react-dom/test-utils';
import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import AddWorkflow from '../../../../smart-components/workflow/add-workflow-modal';
import { IntlProvider } from 'react-intl';
import { APPROVAL_API_BASE } from '../../../../utilities/approval-constants';
import * as wfHelper from '../../../../helpers/workflow/workflow-helper';
import { Button } from '@patternfly/react-core';
import routes from '../../../../constants/approval-routes';
import { mockApi } from '../../../../helpers/shared/__mocks__/user-login';

describe('<AddWorkflow />', () => {
  let initialProps;
  let initialState;
  let workflow;
  let wrapper;

  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;
  const ComponentWrapper = ({ store, children }) => (
    <IntlProvider locale="en">
      <Provider store={store}>
        <MemoryRouter
          initialEntries={['/workflows/add-workflow/']}
          initialIndex={0}
        >
          {children}
        </MemoryRouter>
      </Provider>
    </IntlProvider>
  );

  beforeEach(() => {
    localStorage.setItem('catalog_standalone', true);
    localStorage.setItem('user', 'testUser');
    initialProps = {
      id: '123',
      handleChange: jest.fn()
    };

    initialState = {
      workflowReducer: {
        workflows: {
          data: []
        }
      }
    };

    workflow = {
      name: 'Foo',
      id: '123',
      template: 'templateid',
      description: 'description',
      group_refs: [
        {
          uuid: '123',
          name: 'SampleWorkflow'
        }
      ]
    };

    mockStore = configureStore(middlewares);
  });

  afterEach(() => {
    localStorage.setItem('catalog_standalone', false);
    localStorage.removeItem('user');
  });

  it('should close the form', async () => {
    mockApi
      .onGet(`${APPROVAL_API_BASE}/templates/`)
      .replyOnce(200, { data: [{ id: 'id', title: 'name' }] });

    mockApi
      .onGet(`/api/pinakes/v1/templates/templateid/`)
      .replyOnce(200, { id: 'templateid', title: 'template' });

    mockApi.onGet(`/api/pinakes/v1/workflows/`).replyOnce(200, []);
    mockApi
      .onGet(`/api/pinakes/v1/workflows/?name=undefined`)
      .replyOnce(200, {});
    mockApi
      .onGet(
        `${APPROVAL_API_BASE}/groups/?role=approval-approver&role=approval-admin`
      )
      .replyOnce(200, { data: [{ id: 'id', name: 'name' }] });

    const store = mockStore(initialState);

    const wrapper = mount(
      <ComponentWrapper store={store}>
        <Route
          path="/workflows/add-workflow/"
          render={() => <AddWorkflow {...initialProps} />}
        />
      </ComponentWrapper>
    );
    wrapper.update();
    await act(async () => {
      wrapper
        .find(Button)
        .first()
        .simulate('click');
    });
    wrapper.update();
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual(routes.workflows.index);
  });

  it('should fetch data from api and submit the form', async () => {
    mockApi
      .onGet(`${APPROVAL_API_BASE}/templates/`)
      .replyOnce(200, [{ id: 'templateid', title: 'name' }]);

    mockApi
      .onGet(`${APPROVAL_API_BASE}/templates/?search=template`)
      .replyOnce(200, [{ id: 'templateid', title: 'name' }]);

    mockApi.onGet(`${APPROVAL_API_BASE}/workflows/123/`).replyOnce(200, {
      name: 'Foo',
      id: '123',
      template: 'templateid',
      description: 'description',
      group_refs: [
        {
          uuid: '123',
          name: 'SampleWorkflow'
        }
      ]
    });
    mockApi
      .onGet(`${APPROVAL_API_BASE}/workflows/?&search=Foo`)
      .replyOnce(200, {
        name: 'Foo',
        id: '123',
        template: 'templateid',
        description: 'description',
        group_refs: [
          {
            uuid: '123',
            name: 'SampleWorkflow'
          }
        ]
      });
    mockApi
      .onGet(`${APPROVAL_API_BASE}/templates/`)
      .replyOnce(200, { data: [{ id: 'templateid', title: 'name' }] });

    expect.assertions(6);

    wfHelper.fetchWorkflowByName = jest
      .fn()
      .mockImplementationOnce((value) => {
        expect(value).toEqual('some-name');

        return Promise.resolve({
          data: []
        });
      })
      .mockImplementationOnce((value) => {
        expect(value).toEqual('some-name');

        return Promise.resolve({
          data: []
        });
      });

    mockApi
      .onGet(
        `${APPROVAL_API_BASE}/groups/?role=approval-approver&role=approval-admin`
      )
      .replyOnce(200, { data: [{ id: 'id', name: 'name' }] });

    jest.useFakeTimers();

    const store = mockStore(initialState);

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store}>
          <Route
            path="/workflows/add-workflow"
            render={() => <AddWorkflow {...initialProps} />}
          />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    await act(async () => {
      wrapper.update();
    });

    expect(
      wrapper
        .find('input')
        .first()
        .props().value
    ).toEqual('');
    expect(
      wrapper
        .find('textarea')
        .first()
        .props().value
    ).toEqual('');

    await act(async () => {
      const name = wrapper.find('input').first();
      name.instance().value = 'some-name';
      name.simulate('change');
    });
    wrapper.update();

    await act(async () => {
      jest.advanceTimersByTime(550); // name async validation
      jest.useRealTimers();
    });
    wrapper.update();

    await act(async () => {
      const description = wrapper.find('textarea').first();
      description.instance().value = 'some-description';
      description.simulate('change');
    });
    wrapper.update();

    await act(async () => {
      wrapper
        .find('input')
        .at(1)
        .simulate('click');
    });
    wrapper.update();
    await act(async () => {
      wrapper
        .find('button')
        .at(1)
        .simulate('click');
    });

    wfHelper.addWorkflow = jest
      .fn()
      .mockImplementation(() => Promise.resolve('ok'));

    expect(wfHelper.addWorkflow).not.toHaveBeenCalled();

    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    wrapper.update();

    expect(wfHelper.addWorkflow).toHaveBeenCalledWith({
      name: 'some-name',
      description: 'some-description',
      template: 'id',
      group_refs: []
    });

    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual(routes.workflows.index);
  });
});
