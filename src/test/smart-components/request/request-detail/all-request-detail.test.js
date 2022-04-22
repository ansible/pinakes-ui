import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import AllRequestDetail from '../../../../smart-components/request/request-detail/my-request-detail';
import { APPROVAL_API_BASE } from '../../../../utilities/approval-constants';
import RequestInfoBar from '../../../../smart-components/request/request-detail/request-info-bar';
import RequestTranscript from '../../../../smart-components/request/request-detail/request-transcript';
import { BreadcrumbItem } from '@patternfly/react-core';
import {
  APPROVAL_ADMINISTRATOR_ROLE,
  APPROVAL_APPROVER_ROLE
} from '../../../../helpers/shared/approval-helpers';
import { IntlProvider } from 'react-intl';
import { mockApi } from '../../../../helpers/shared/__mocks__/user-login';

const ComponentWrapper = ({
  store,
  children,
  initialEntries = ['/foo?request=123']
}) => (
  <IntlProvider locale="en">
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </Provider>
  </IntlProvider>
);

describe('<AllRequestDetail />', () => {
  let initialProps;
  const middlewares = [thunk, promiseMiddleware, notificationsMiddleware()];
  let mockStore;
  let initialState;
  let roles;

  beforeEach(() => {
    initialProps = {
      breadcrumbs: [
        {
          title: 'Foo'
        }
      ]
    };
    roles = [APPROVAL_ADMINISTRATOR_ROLE, APPROVAL_APPROVER_ROLE];
    mockStore = configureStore(middlewares);
    initialState = {
      requestReducer: {
        isRequestDataLoading: true,
        selectedRequest: {
          id: '123',
          name: 'Test product',
          group_name: 'Test group'
        },
        requestContent: {}
      }
    };
    localStorage.setItem('catalog_standalone', true);
    localStorage.setItem('user', 'testUser');
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('catalog_standalone', false);
    localStorage.removeItem('user');
  });

  it('should render request details', async (done) => {
    mockApi.onGet(`${APPROVAL_API_BASE}/requests/123/content/`).replyOnce(200, {
      data: {
        params: { test: 'value' },
        product: 'Test product',
        order_id: '321',
        portfolio: 'TestPortfolio'
      }
    });
    mockApi
      .onGet(`${APPROVAL_API_BASE}/requests/123/?extra=true`)
      .replyOnce(200, {
        data: {
          params: { test: 'value' },
          product: 'Test product',
          order_id: '321',
          portfolio: 'TestPortfolio'
        }
      });
    const store = mockStore(
      (initialState = {
        requestReducer: {
          selectedRequest: {
            actions: [
              {
                id: '266',
                created_at: '2019-12-20',
                request_id: '123',
                processed_by: 'system',
                operation: 'start'
              }
            ],
            created_at: '2019-12-20',
            decision: 'undecided',
            group_name: 'Test Group',
            id: '123',
            name: 'Test Product',
            notified_at: '2019-12-20',
            number_of_children: 0,
            number_of_finished_children: 0,
            owner: 'test_owner',
            requester_name: 'A Name',
            state: 'notified',
            workflow_id: '123'
          },
          requestContent: {
            order_id: '363',
            params: {},
            portfolio: 'Portfolio',
            product: 'Product'
          },
          isRequestDataLoading: false
        }
      })
    );

    let wrapper;
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={store}>
          <Route
            path="/foo"
            render={(props) => (
              <AllRequestDetail
                {...props}
                {...initialProps}
                isFetching={false}
              />
            )}
          />
        </ComponentWrapper>
      );
    });
    wrapper.update();
    expect(wrapper.find(RequestInfoBar)).toHaveLength(1);
    expect(wrapper.find(RequestTranscript)).toHaveLength(1);

    expect(wrapper.find(BreadcrumbItem)).toHaveLength(2);
    expect(
      wrapper
        .find(BreadcrumbItem)
        .first()
        .text()
    ).toEqual('My requests');
    expect(
      wrapper
        .find(BreadcrumbItem)
        .first()
        .props().isActive
    ).toEqual(false);

    expect(
      wrapper
        .find(BreadcrumbItem)
        .last()
        .text()
    ).toEqual('Request 123');
    expect(
      wrapper
        .find(BreadcrumbItem)
        .last()
        .props().isActive
    ).toEqual(true);
    done();
  });
});
