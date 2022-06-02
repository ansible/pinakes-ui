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
      postMethod: jest.fn(),
      handleChange: jest.fn()
    };
    initialState = {};
    mockStore = configureStore(middlewares);
  });

  afterEach(() => {
    global.localStorage.setItem('catalog_standalone', false);
    global.localStorage.removeItem('user');
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
      .onGet(`${APPROVAL_API_BASE}/groups/?role=approval-approver`)
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
});
