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
import { Chip } from '@patternfly/react-core';
import { mockApi } from '../../../../helpers/shared/__mocks__/user-login';

describe('<EditWorkflow />', () => {
  let initialProps;
  let initialState;
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;
  let workflow;
  let wrapper;

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
      postMethod: jest.fn(),
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
    global.localStorage.setItem('catalog_standalone', false);
    global.localStorage.removeItem('user');
  });

  it('should fetch data from api and submit the form', async () => {
    mockApi
      .onGet(`${APPROVAL_API_BASE}/workflows/123/`)
      .replyOnce(200, { ...workflow });

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
      .onGet(`${APPROVAL_API_BASE}/groups/?role=approval-approver`)
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

    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual(routes.workflows.index);
  });

  it('should close the form', async () => {
    mockApi
      .onGet(`${APPROVAL_API_BASE}/workflows/123/`)
      .replyOnce(200, { ...workflow });

    wfHelper.fetchWorkflowByName = jest.fn().mockImplementation(() =>
      Promise.resolve({
        data: []
      })
    );

    mockApi
      .onGet(`${APPROVAL_API_BASE}/groups/?role=approval-approver`)
      .replyOnce(200, { data: [{ uuid: 'id', name: 'name' }] });

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
