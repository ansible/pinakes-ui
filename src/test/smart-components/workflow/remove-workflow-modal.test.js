import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import { IntlProvider } from 'react-intl';

import RemoveWorkflowModal from '../../../smart-components/workflow/remove-workflow-modal';
import { Modal, Text, Title } from '@patternfly/react-core';
import { APPROVAL_API_BASE } from '../../../utilities/approval-constants';
import routes from '../../../constants/approval-routes';
import { mockApi } from '../../../helpers/shared/__mocks__/user-login';

const ComponentWrapper = ({ store, children, initialEntries = ['/'] }) => (
  <IntlProvider locale="en">
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries} initialIndex={1}>
        <IntlProvider locale="en">{children}</IntlProvider>
      </MemoryRouter>
    </Provider>
  </IntlProvider>
);

describe('<RemoveWorkflowModal />', () => {
  let initialProps;
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;
  let initialState;

  beforeEach(() => {
    initialProps = {
      fetchData: jest.fn(),
      resetSelectedWorkflows: jest.fn()
    };
    mockStore = configureStore(middlewares);
    initialState = {
      workflowReducer: {
        workflows: {
          data: [
            {
              id: '123',
              name: 'WfName'
            },
            {
              id: '456',
              name: 'WfName'
            }
          ]
        }
      }
    };
    localStorage.setItem('catalog_standalone', true);
    localStorage.setItem('user', 'testUser');
  });

  afterEach(() => {
    global.localStorage.setItem('catalog_standalone', false);
    global.localStorage.removeItem('user');
  });

  it('should not render approval process modal', () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <ComponentWrapper store={store}>
        <RemoveWorkflowModal {...initialProps} />
      </ComponentWrapper>
    );
    expect(wrapper.find(Modal)).toHaveLength(0);
  });

  it('should render approval process modal- single', () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <ComponentWrapper store={store} initialEntries={['?workflow=123']}>
        <RemoveWorkflowModal {...initialProps} />
      </ComponentWrapper>
    );
    expect(wrapper.find(Modal)).toHaveLength(1);
    expect(
      wrapper
        .find(Title)
        .first()
        .text()
    ).toEqual('Delete approval process?');
    expect(
      wrapper
        .find(Text)
        .first()
        .text()
    ).toEqual('WfName will be removed.');
  });

  it('should render linked apps and resources', () => {
    const initialStateWithLinks = {
      workflowReducer: {
        workflows: {
          data: [
            {
              id: '123',
              name: 'WfName',
              metadata: {
                object_dependencies: {
                  catalog: ['PortfolioItem', 'Portfolio'],
                  topology: ['ServiceInventory']
                }
              }
            }
          ]
        }
      }
    };
    const store = mockStore(initialStateWithLinks);
    const wrapper = mount(
      <ComponentWrapper store={store} initialEntries={['?workflow=123']}>
        <RemoveWorkflowModal {...initialProps} />
      </ComponentWrapper>
    );
    expect(wrapper.find(Modal)).toHaveLength(1);
    expect(
      wrapper
        .find(Title)
        .first()
        .text()
    ).toEqual('Delete approval process?');
    expect(
      wrapper
        .find(Text)
        .first()
        .text()
    ).toEqual(
      'WfName will be removed from the following applications: PinakesTopological inventory'
    );
  });

  it('should render approval process modal - single - not in table', async () => {
    mockApi
      .onGet(`${APPROVAL_API_BASE}/workflows/235/`)
      .replyOnce(200, { name: 'Fetched WF' });

    let wrapper;
    const store = mockStore(initialState);

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store} initialEntries={['/?workflow=235']}>
          <RemoveWorkflowModal {...initialProps} />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    expect(wrapper.find(Modal)).toHaveLength(1);
    expect(
      wrapper
        .find(Title)
        .first()
        .text()
    ).toEqual('Delete approval process?');
    expect(
      wrapper
        .find(Text)
        .first()
        .text()
    ).toEqual('Fetched WF will be removed.');
  });

  it('should return to table when fetching failed', async () => {
    mockApi
      .onGet(`${APPROVAL_API_BASE}/workflows/235`)
      .replyOnce({ status: 500 });

    let wrapper;
    const store = mockStore(initialState);

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store} initialEntries={['/?workflow=235']}>
          <RemoveWorkflowModal {...initialProps} />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual(routes.workflows.index);
  });

  it('should render approval process modal - multi', () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <ComponentWrapper store={store}>
        <RemoveWorkflowModal {...initialProps} ids={['123', '456']} />
      </ComponentWrapper>
    );
    expect(wrapper.find(Modal)).toHaveLength(1);
    expect(
      wrapper
        .find(Title)
        .first()
        .text()
    ).toEqual('Delete approval processes?');
    expect(
      wrapper
        .find(Text)
        .first()
        .text()
    ).toEqual('2 approval processes will be removed.');
  });

  it('should render approval process modal and call cancel callback', () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <ComponentWrapper store={store} initialEntries={['/remove']}>
        <Route
          to="/remove"
          render={(props) => (
            <RemoveWorkflowModal {...props} ids={['123']} {...initialProps} />
          )}
        />
      </ComponentWrapper>
    );
    wrapper.update();
    expect(wrapper.find(Modal)).toHaveLength(1);

    wrapper.find('button#cancel-remove-workflow').simulate('click');
    wrapper.update();
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual(routes.workflows.index);
  });

  it('should remove single approval process and redirect', async (done) => {
    expect.assertions(2);
    const store = mockStore(initialState);
    mockApi
      .onDelete(`${APPROVAL_API_BASE}/workflows/123/`)
      .replyOnce((req, res) => {
        expect(req).toBeTruthy();
        return res.status(200);
      });

    const wrapper = mount(
      <ComponentWrapper store={store} initialEntries={['/remove']}>
        <Route
          to="/remove"
          render={(props) => (
            <RemoveWorkflowModal {...props} ids={['123']} {...initialProps} />
          )}
        />
      </ComponentWrapper>
    );
    wrapper.update();

    await act(async () => {
      wrapper.find('button#submit-remove-workflow').simulate('click');
    });
    wrapper.update();
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/approval/workflows');

    done();
  });

  it('should remove multiple workflows and redirect', async (done) => {
    expect.assertions(3);
    const store = mockStore(initialState);
    mockApi.onDelete(`${APPROVAL_API_BASE}/workflows/123/`).replyOnce((req) => {
      expect(req).toBeTruthy();
      return [200];
    });
    mockApi.onDelete(`${APPROVAL_API_BASE}/workflows/456/`).replyOnce((req) => {
      expect(req).toBeTruthy();
      return [200];
    });

    const wrapper = mount(
      <ComponentWrapper store={store} initialEntries={['/approval/workflows']}>
        <Route
          to="/remove"
          render={(props) => (
            <RemoveWorkflowModal
              {...props}
              ids={['123', '456']}
              {...initialProps}
            />
          )}
        />
      </ComponentWrapper>
    );
    wrapper.update();

    await act(async () => {
      wrapper.find('button#submit-remove-workflow').simulate('click');
    });
    wrapper.update();
    expect(
      wrapper.find(MemoryRouter).instance().history.location.pathname
    ).toEqual('/approval/workflows');

    done();
  });
});
