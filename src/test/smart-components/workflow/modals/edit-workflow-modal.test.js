import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { act } from 'react-dom/test-utils';

import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import EditWorkflow from '../../../../smart-components/workflow/edit-workflow-modal';
import { IntlProvider } from 'react-intl';
import { APPROVAL_API_BASE } from '../../../../utilities/approval-constants';
import * as wfHelper from '../../../../helpers/workflow/workflow-helper';
import { Button } from '@patternfly/react-core';
import routes from '../../../../constants/approval-routes';
import { mockApi } from '../../../../helpers/shared/__mocks__/user-login';

describe('<EditWorkflow />', () => {
  let initialProps;
  let initialState;
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;
  let workflow;
  let wrapper;
  const postMethod = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: []
    })
  );

  const ComponentWrapper = ({ store, children }) => (
    <IntlProvider locale="en">
      <Provider store={store}>
        <MemoryRouter
          initialEntries={['/workflows/edit-workflow/?workflow=123']}
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
      postMethod,
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
    mockApi.onGet(`${APPROVAL_API_BASE}/workflows/?&name=Foo`).replyOnce(200, {
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

    expect.assertions(7);

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
            path="/workflows/edit-workflow"
            render={() => <EditWorkflow {...initialProps} />}
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
    ).toEqual(workflow.name);
    expect(
      wrapper
        .find('textarea')
        .first()
        .props().value
    ).toEqual(workflow.description);

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

    wfHelper.updateWorkflow = jest
      .fn()
      .mockImplementation(() => Promise.resolve('ok'));

    expect(wfHelper.updateWorkflow).not.toHaveBeenCalled();

    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    wrapper.update();

    expect(wfHelper.updateWorkflow).toHaveBeenCalledWith({
      ...workflow,
      name: 'some-name',
      description: 'some-description'
    });

    expect(postMethod).toHaveBeenCalled();

    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual(routes.workflows.index);
  });

  it('should close the form', async () => {
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

    expect.assertions(1);

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

    wfHelper.fetchWorkflowByName = jest.fn().mockImplementation(() =>
      Promise.resolve({
        data: []
      })
    );

    jest.useFakeTimers();

    const store = mockStore(initialState);

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store}>
          <Route
            path="/workflows/edit-workflow"
            render={() => <EditWorkflow {...initialProps} />}
          />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    await act(async () => {
      jest.advanceTimersByTime(550); // initial async validation
      jest.useRealTimers();
    });
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
});
